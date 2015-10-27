var getWeatherForecast = function (dayIndex, forecastDate, weatherManager) {
  //todo: temporal. figure out typical weather
  var defaultWeather = {
    temp: 20.0,
    main: 'Clear'
  };

  var currentWeather = dayIndex < 14 && weatherManager.getWeatherFor(forecastDate);

  return currentWeather || defaultWeather;
};


var predict = function (days, locationId) {
  logger.info('Make prediction', {days: days, locationId: locationId});

  var today = new Date();
  var dateMoment = moment();
  var prediction = new GooglePredictionApi(locationId);
  var areas = Areas.find({locationId: locationId});
  var roleManagerId = Roles.getRoleByName('Manager')._id;

  var weatherManager = new WeatherManager(locationId);
  weatherManager.updateForecast();

  var currentWeather;
  for (var i = 0; i < days; i++) {

    currentWeather = getWeatherForecast(i, dateMoment.toDate(), weatherManager);

    areas.forEach(function (area) {
      var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': area._id});
      var items = MenuItems.find(menuItemsQuery, {}); //get menu items for current area

      var notification = new Notification();

      items.forEach(function (item) {
        var dataVector = [item._id, currentWeather.temp, currentWeather.main, dateMoment.dayOfYear()];
        var quantity = parseInt(prediction.makePrediction(dataVector), locationId);
        var predictItem = {
          date: moment(dateMoment).toDate(),
          predictionQuantity: quantity,
          predictionUpdatedAt: today,
          menuItemId: item._id,
          relations: item.relations
        };

        var currentData = DailySales.findOne({ //SalesPrediction
          date: TimeRangeQueryBuilder.forDay(dateMoment),
          menuItemId: predictItem.menuItemId
        });
        //checking need for notification push
        if (i < 14 && currentData) {
          if (currentData) {
            if (currentData.quantity != predictItem.predictionQuantity) {
              var itemName = MenuItems.findOne(HospoHero.prediction.getMenuItemsForPredictionQuery({_id: predictItem.menuItemId})).name;

              notification.add(dateMoment.toDate(), itemName, currentData.quantity, predictItem.quantity);
            }
          }
        }

        DailySales.update({ //SalesPrediction
          date: TimeRangeQueryBuilder.forDay(predictItem.date),
          menuItemId: predictItem.menuItemId
        }, predictItem, {upsert: true});

      });

      var receiversQuery = {};
      receiversQuery[area._id] = roleManagerId;
      var receiversIds = Meteor.users.find({roles: receiversQuery}).map(function (user) {
        return user._id;
      });
      notification.send(receiversIds);
    });

    dateMoment.add(1, 'day');
  }
};


var updateForecastDate = function (locationId, property, dateValue) {
  var properties = _.isArray(property) ? property : [property];

  var updateQuery = _.reduce(properties, function (query, property) {
    query[property] = dateValue;
    return query;
  }, {});

  ForecastDates.update({locationId: locationId}, {$set: updateQuery}, {upsert: true});
};


salesPredictionUpdateJob = function () {
  logger.info('started prediction update job');

  var locations = Locations.find({archived: {$ne: true}});

  var todayMoment = moment();

  locations.forEach(function (location) {
    if (HospoHero.prediction.isAvailableForLocation(location)) {
      var lastUpdates = ForecastDates.findOne({locationId: location._id});

      var needFullUpdate = !lastUpdates || !lastUpdates.lastThreeDays
        || todayMoment.diff(lastUpdates.lastSixWeeks) >= HospoHero.dateUtils.getMillisecondsFromDays(42);

      if (needFullUpdate) {
        predict(84, location._id);
        updateForecastDate(location._id, ['lastSixWeeks', 'lastThreeDays'], todayMoment.toDate());

      } else if (todayMoment.diff(lastUpdates.lastThreeDays) >= HospoHero.dateUtils.getMillisecondsFromDays(3)) {
        predict(7, location._id);
        updateForecastDate(location._id, 'lastThreeDays', todayMoment.toDate());

      } else if (todayMoment.diff(lastUpdates.lastThreeDays) >= HospoHero.dateUtils.getMillisecondsFromDays(3)) {
        predict(2, location._id);
      }
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


