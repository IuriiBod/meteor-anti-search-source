var ForecastMaker = function (locationId) {
  this._locationId = locationId;

  this._weatherManager = new WeatherManager(locationId);
  this._weatherManager.updateForecast();

  this._predictionApi = new GooglePredictionApi(locationId);
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
    date: TimeRangeQueryBuilder.forDay(newForecastInfo.date),
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

  var changes = [];

  return {
    addChange: function (newForecastInfo, menuItem) {
      var oldForecast = DailySales.findOne({
        date: TimeRangeQueryBuilder.forDay(newForecastInfo.date),
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
        //receiversIds.forEach(function (receiverId) {
        //  new UniEmailSender({
        //    senderId: Meteor.users.findOne({})._id,//todo: temporal, remove after email sender improvement
        //    receiverId: receiverId,
        //    emailTemplate: {
        //      subject: 'Some predictions have been changed',
        //      blazeTemplateToRenderName: 'forecastUpdate'
        //    },
        //    templateData: {
        //      changes: changes
        //    },
        //    needToNotify: true,
        //    notificationData: {
        //      type: 'prediction',
        //      actionType: 'update',
        //      relations: {
        //        organizationId: area.organizationId,
        //        locationId: area.locationId,
        //        areaId: area._id
        //      }
        //    }
        //  }).send();
        //});
      }
    }
  };
};


ForecastMaker.prototype._predictFor = function (days) {
  logger.info('Make prediction', {days: days, locationId: this._locationId});

  var today = new Date();
  var dateMoment = moment();
  var self = this;

  var areas = Areas.find({locationId: this._locationId});

  for (var i = 0; i < days; i++) {
    var currentWeather = this._getWeatherForecast(i, dateMoment.toDate());

    areas.forEach(function (area) {
      var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': area._id}, true);
      var items = MenuItems.find(menuItemsQuery, {}); //get menu items for current area

      var notificationSender = self._getNotificationSender(area);

      items.forEach(function (menuItem) {
        var dataVector = [menuItem._id, currentWeather.temp, currentWeather.main, dateMoment.dayOfYear()];
        var quantity = self._predictionApi.makePrediction(dataVector);

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
    date: TimeRangeQueryBuilder.forDay(predictionDate)
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
  var updateDayIntervals = [84, 7, 2];
  var self = this;

  updateDayIntervals.forEach(function (interval) {
    if (self._needToUpdate(interval)) {
      self._predictFor(interval);
      return false;
    }
  });
};


//=============== update forecast cron job =================
salesPredictionUpdateJob = function () {
  logger.info('started prediction update job');

  var locations = Locations.find({archived: {$ne: true}});

  locations.forEach(function (location) {
    if (HospoHero.prediction.isAvailableForLocation(location)) {
      var forecastMaker = new ForecastMaker(location._id);
      forecastMaker.makeForecast();
    }
  });
};


//!!! disable it temporaly to be able control it manually
//if (!HospoHero.isDevelopmentMode()) {
//  SyncedCron.add({
//    name: 'Forecast refresh',
//    schedule: function (parser) {
//      return parser.text('at 05:00 am');
//    },
//    job: salesPredictionUpdateJob
//  });
//
//  Meteor.startup(function () {
//    //if we run first time -> make predictions immediately (in other thread)
//    Meteor.defer(salesPredictionUpdateJob);
//  });
//}
