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
    temp: 25,
    main: 'Sunny'
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
        var receiversIds = Roles.getUsersByActionForArea('view forecast', area._id).map(user => user._id);

        logger.info('Notify about prediction change', {receivers: receiversIds, changes: changes});

        var notificationTitle = 'Some predictions have been changed';
        var notificationSender = new NotificationSender(notificationTitle, 'forecast-update', {changes: changes});

        receiversIds.forEach(function (receiverId) {
          notificationSender.sendNotification(receiverId);
        });
      }
    }
  };
};


ForecastMaker.prototype._predictFor = function (totalDaysCount) {
  logger.info('Make prediction', {days: totalDaysCount, locationId: this._locationId});

  var today = new Date();
  var dateToMakePredictionFrom = HospoHero.prediction.getDateThreshold(); // new Date() default
  var dateMoment = HospoHero.dateUtils.getDateMomentForLocation(dateToMakePredictionFrom, this._location).startOf('day');

  var areas = Areas.find({locationId: this._locationId});

  var self = this;
  let createProcessAreaFn = (currentDayNumber, currentWeather) => (area) => {
    var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': area._id}, true);
    var items = MenuItems.find(menuItemsQuery, {_id: 1, relations: 1, status: 1, name: 1}); //get menu items for current area

    var notificationSender = self._getNotificationSender(area);

    items.forEach(function (menuItem) {
      let dataVector = new DataVector(dateMoment, currentWeather);
      let quantity = self._predictionApi.makePrediction(menuItem._id, dataVector.getTestingData());

      logger.info('Made prediction', {menuItem: menuItem.name, date: dateMoment.toDate(), predictedQty: quantity});

      var predictItem = {
        date: moment(dateMoment).toDate(),
        predictionQuantity: quantity,
        predictionUpdatedAt: today,
        menuItemId: menuItem._id,
        relations: menuItem.relations
      };

      self._updateForecastEntry(predictItem);

      if (currentDayNumber < 14) {
        notificationSender.addChange(predictItem, menuItem);
      }
    });

    notificationSender.send();
  };

  for (let currentDayNumber = 0; currentDayNumber < totalDaysCount; currentDayNumber++) {
    let currentWeather = this._getWeatherForecast(currentDayNumber, dateMoment.toDate());
    areas.forEach(createProcessAreaFn(currentDayNumber, currentWeather));
    dateMoment.add(1, 'day');
  }
};


ForecastMaker.prototype._getPredictionUpdatedDate = function (interval) {
  var predictionDate = moment(HospoHero.prediction.getDateThreshold());
  predictionDate.add(interval, 'day');

  var dailySale = DailySales.findOne({
    'relations.locationId': this._locationId,
    date: TimeRangeQueryBuilder.forDay(predictionDate, this._locationId),
    predictionQuantity: {$gte: 0}
  });

  return dailySale && dailySale.predictionUpdatedAt;
};


ForecastMaker.prototype._needToUpdate = function (interval) {
  var halfOfInterval = Math.round(interval / 2);
  var predictionUpdatedDate = this._getPredictionUpdatedDate(halfOfInterval + 1) || false;
  var shouldBeUpdatedBy = moment(HospoHero.prediction.getDateThreshold()).subtract(halfOfInterval, 'day');

  return !predictionUpdatedDate || moment(predictionUpdatedDate).isBefore(shouldBeUpdatedBy);
};


ForecastMaker.prototype.makeForecast = function () {
  var self = this;

  this._updateDayIntervals.every(function (interval) {
    if (self._needToUpdate(interval)) {
      self._predictFor(interval);
      return false;
    }
    return true;
  });
};

ForecastMaker.prototype._updateDayIntervals = Meteor.settings.prediction.forecastIntervals;


updateForecastForLocation = function (location) {
  if (HospoHero.prediction.isAvailableForLocation(location)) {
    var forecastMaker = new ForecastMaker(location);
    forecastMaker.makeForecast();
  }
};


if (!HospoHero.isDevelopmentMode()) {
  HospoHero.LocationScheduler.addDailyJob('Update forecast', function () {
    return 3; //3:00 AM
  }, function (location) {
    logger.info('Started forecast generation', {locationId: location._id});
    updateForecastForLocation(location);
  });
}
