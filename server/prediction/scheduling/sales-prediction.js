var ForecastMaker = function (location) {
  this._location = location;
  this._locationId = location._id;

  this._weatherManager = new WeatherManager(this._locationId);
  this._weatherManager.updateForecast();

  this._predictionApi = new GooglePredictionApi(this._locationId);
};


ForecastMaker.prototype._getWeatherForecast = function (dayIndex, forecastDate) {
  //todo: temporal. figure out typical weather
  var defaultWeather = {
    temp: 20.0,
    main: 'Clear'
  };

  var currentWeather = dayIndex < 14 && this._weatherManager.getWeatherFor(forecastDate);

  return currentWeather || defaultWeather;
};


ForecastMaker.prototype._updateForecastEntry = function (newForecastInfo) {
  DailySales.update({
    date: TimeRangeQueryBuilder.forDay(newForecastInfo.date, this._location),
    menuItemId: newForecastInfo.menuItemId
  }, {$set: newForecastInfo}, {upsert: true});
};


ForecastMaker.prototype._getNotificationSender = function (area) {
  var roleManagerId = Roles.getRoleByName('Manager')._id;
  var getReceivers = function () {
    var receiversQuery = {};
    receiversQuery[area._id] = roleManagerId;
    return Meteor.users.find({roles: receiversQuery}).map(function (user) {
      return user._id;
    });
  };

  var self = this;
  var changes = [];

  return {
    addChange: function (newForecastInfo, menuItem) {
      var oldForecast = DailySales.findOne({
        date: TimeRangeQueryBuilder.forDay(newForecastInfo.date, self._location),
        menuItemId: newForecastInfo.menuItemId
      });

      if (oldForecast) {
        if (oldForecast.predictionQuantity !== newForecastInfo.predictionQuantity) {
          changes.push({
            date: moment(newForecastInfo.date).format("YYYY-MM-DD"),
            name: menuItem.name,
            prevQuantity: oldForecast.predictionQuantity,
            newQuantity: newForecastInfo.predictionQuantity
          });
        }
      }
    },

    send: function () {
      if (changes.length > 0) {
        var receiversIds = getReceivers();
        logger.info('Notify about prediction change', {receivers: receiversIds, changes: changes});
        var notificationTitle = 'Some predictions have been changed';
        var notificationSender = new NotificationSender(notificationTitle, 'forecast-update', changes);
        receiversIds.forEach(function (receiverId) {
          notificationSender.sendNotification(receiverId);
        });
      }
    }
  };
};


ForecastMaker.prototype._predictFor = function (days) {
  logger.info('Make prediction', {days: days, locationId: this._locationId});

  var today = new Date();
  var dateMoment = HospoHero.dateUtils.getDateMomentForLocation(new Date(), this._location);
  var self = this;

  var areas = Areas.find({locationId: this._locationId});

  for (var i = 0; i < days; i++) {
    var currentWeather = this._getWeatherForecast(i, dateMoment.toDate());

    areas.forEach(function (area) {
      var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': area._id}, true);
      var items = MenuItems.find(menuItemsQuery, {}); //get menu items for current area

      var notificationSender = self._getNotificationSender(area);

      items.forEach(function (menuItem) {
        var dataVector = [currentWeather.temp, currentWeather.main, dateMoment.format('ddd'), dateMoment.dayOfYear()];
        var quantity = self._predictionApi.makePrediction(menuItem._id, dataVector);

        logger.info('Made prediction', {menuItem: menuItem.name, date: dateMoment.toDate(), predictedQty: quantity});

        var predictItem = {
          date: moment(dateMoment).toDate(),
          predictionQuantity: quantity,
          predictionUpdatedAt: today,
          menuItemId: menuItem._id,
          relations: menuItem.relations
        };

        self._updateForecastEntry(predictItem);

        //checking need for notification push
        if (i < 14) {
          notificationSender.addChange(predictItem, menuItem);
        }
      });

      notificationSender.send();
    });

    dateMoment.add(1, 'day');
  }
};


ForecastMaker.prototype._getPredictionUpdatedDate = function (interval) {
  var predictionDate = moment();
  predictionDate.add(interval, 'day');

  var menuItemFromCurrentLocation = MenuItems.findOne({'relations.locationId': this._locationId});

  var dailySale = DailySales.findOne({
    menuItemId: menuItemFromCurrentLocation._id,
    date: TimeRangeQueryBuilder.forDay(predictionDate, this._locationId)
  });

  if (dailySale) {
    return dailySale.predictionUpdatedAt;
  }
};


ForecastMaker.prototype._needToUpdate = function (interval) {
  var halfOfInterval = parseInt(interval / 2);
  var predictionUpdatedDate = this._getPredictionUpdatedDate(halfOfInterval + 1) || false;
  var shouldBeUpdatedBy = moment().subtract(halfOfInterval, 'day');

  return !predictionUpdatedDate || moment(predictionUpdatedDate) < shouldBeUpdatedBy;
};


ForecastMaker.prototype.makeForecast = function () {
  var self = this;

  this._updateDayIntervals.forEach(function (interval) {
    if (self._needToUpdate(interval)) {
      self._predictFor(interval);
      return false;
    }
  });
};

ForecastMaker.prototype._updateDayIntervals = [14];//[84, 7, 2];


updateForecastForLocation = function (location) {
  if (HospoHero.prediction.isAvailableForLocation(location)) {
    var forecastMaker = new ForecastMaker(location);
    forecastMaker.makeForecast();
  }
};


if (HospoHero.isProductionMode()) {
  HospoHero.LocationScheduler.addDailyJob('Update forecast', function (location) {
    return 3; //3:00 AM
  }, function (location) {
    logger.error('Started forecast generation', {locationId: location._id});
    //updateForecastForLocation(location);
  });
}


if (HospoHero.isDevelopmentMode()) {
  ForecastMaker.prototype._updateDayIntervals = [7];
}
