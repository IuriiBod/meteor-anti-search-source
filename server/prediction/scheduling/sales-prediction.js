salesPredictionUpdateJob = function () {
  logger.info('started prediction update job');

  var updateDayIntervals = [84, 7, 2];
  var locations = Locations.find({archived: {$ne: true}});
  locations.forEach(function (location) {
    if (HospoHero.prediction.isAvailableForLocation(location)) {

      updateDayIntervals.forEach(function (interval) {
        var needToUpdate = isNeedToUpdate(interval, location._id);
        if (needToUpdate) {
          predict(interval, location._id);
        }
      });
    }
  });
};

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

  for (var i = 0; i < days; i++) {

    var currentWeather = getWeatherForecast(i, dateMoment.toDate(), weatherManager);

    areas.forEach(function (area) {
      var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': area._id});
      var items = MenuItems.find(menuItemsQuery, {}); //get menu items for current area

      var notification = new Notification();

      items.forEach(function (item) {
        var dataVector = [item._id, currentWeather.temp, currentWeather.main, dateMoment.dayOfYear()];
        var quantity = parseInt(prediction.makePrediction(dataVector), locationId);

        logger.info('Made prediction', {menuItem: item.name, date: dateMoment.toDate(), predictedQty: quantity});

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

        DailySales.update({
          date: TimeRangeQueryBuilder.forDay(predictItem.date),
          menuItemId: predictItem.menuItemId
        }, {$set: predictItem}, {upsert: true});

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

var getPredicionUpdatedDate = function (locationId, interval) {
  var predictionDate = moment();
  predictionDate.add(interval, 'day');

  var menuItemFromCurrentLocation = MenuItems.findOne({'relations.locationId': locationId});
  var dailySaleQuery = {menuItemId: menuItemFromCurrentLocation._id};
  _.extend(dailySaleQuery, {date: TimeRangeQueryBuilder.forDay(predictionDate)});

  var dailySale = DailySales.findOne(dailySaleQuery);
  if (dailySale) {
    return dailySale.predictionUpdatedAt;
  }
};

var isNeedToUpdate = function (interval, locationId) {
  var halfOfInterval = parseInt(interval/2);
  var predictionUpdatedDate = getPredicionUpdatedDate(locationId, halfOfInterval+1) || false;
  var shouldBeUpdatedBy = moment().subtract(halfOfInterval, 'day');

  return !predictionUpdatedDate || moment(predictionUpdatedDate) < shouldBeUpdatedBy;
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


