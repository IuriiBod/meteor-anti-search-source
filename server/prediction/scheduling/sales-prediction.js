var predict = function (days, locationId) {
  logger.info('Make prediction', {days: days, locationId: locationId});

  var today = new Date();
  var dateMoment = moment();
  var prediction = new GooglePredictionApi(locationId);
  var areas = Areas.find({locationId: locationId});
  var roleManagerId = Roles.getRoleByName('Manager')._id;

  Weather.updateWeatherForecastForLocation(locationId);

  var currentWeather;
  for (var i = 1; i <= days; i++) {
    var dayOfYear = dateMoment.dayOfYear();

    if (i < 15) {
      currentWeather = WeatherForecast.findOne({locationId: locationId, date: TimeRangeQueryBuilder.forDay(today)});
    } else {
      //todo: temporal. figure out typical weather
      currentWeather = {
        temp: 20.0,
        main: 'Clear'
      }
    }

    areas.forEach(function (area) {
      var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': area._id});
      var items = MenuItems.find(menuItemsQuery, {}); //get menu items for current area

      var notification = new Notification();

      items.forEach(function (item) {
        var dataVector = [item._id, currentWeather.temp, currentWeather.main, dayOfYear];
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

var getPredicionUpdatedDate = function (locationId, interval) {
  var predictionDate = moment();
  predictionDate.add(interval - 1, 'day');

  var menuItemFromCurrentLocation = MenuItems.findOne({'relations.locationId': locationId});

  var dailySaleQuery = {menuItemId: menuItemFromCurrentLocation._id};
  _.extend(dailySaleQuery, {date: TimeRangeQueryBuilder.forDay(predictionDate)});

  var dailySale = DailySales.findOne(dailySaleQuery);

  if (dailySale) {
    return dailySale.predictionUpdatedAt;
  }
};

salesPredictionUpdateJob = function () {
  logger.info('started prediction update job');

  var updateDayIntervals = [84, 7, 2];
  var locations = Locations.find({archived: {$ne: true}});
  locations.forEach(function (location) {
    if (HospoHero.prediction.isAvailableForLocation(location)) {

      updateDayIntervals.forEach(function (interval) {
        var predictionUpdatedDate = getPredicionUpdatedDate(location._id, interval, 'day') || false;
        var shouldBeUpdatedBy = moment().subtract(parseInt(interval/2), 'day');

        if (!predictionUpdatedDate || moment(predictionUpdatedDate) < shouldBeUpdatedBy) {
          predict(interval, location._id);
        }
      });
    }
  });
};


if (!HospoHero.isDevelopmentMode()) {
  SyncedCron.add({
    name: 'Forecast refresh',
    schedule: function (parser) {
      return parser.text('at 05:00 am');
    },
    job: salesPredictionUpdateJob
  });

  Meteor.startup(function () {
    //if we run first time -> make predictions immediately (in other thread)
    Meteor.defer(salesPredictionUpdateJob);
  });
}


