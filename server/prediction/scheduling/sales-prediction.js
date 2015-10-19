var predict = function (days, locationId) {
  logger.info('Make prediction', {days: days, locationId: locationId});

  var today = new Date();
  var dateMoment = moment();
  var prediction = new GooglePredictionApi(locationId);
  var areas = Areas.find({locationId:locationId});
  var roleManagerId = 'rnz28xNqXj645cHmm';
  //forecast for 15 days

  OpenWeatherMap.updateWeatherForecastForLocation(locationId);

  var currentWeather;
  for (var i = 1; i <= days; i++) {
    var dayOfYear = dateMoment.dayOfYear();

    if (i < 16) {
      currentWeather = WeatherForecast.findOne({locationId: locationId, date: TimeRangeQueryBuilder.forDay(today)});
    } else {
        main: "Clear",
      //todo: temporal. figure out typical weather
      currentWeather = {
        temp: 20.0
      }
    }

    areas.forEach(function (area) {
      var items = MenuItems.find({'relations.locationId': locationId, 'relations.areaId':area._id}, {}); //get menu items for current area
      var notification = new Notification();

      items.forEach(function (item) {
        var dataVector = [item._id, currentWeather.temp, currentWeather.main, dayOfYear];
        var quantity = parseInt(prediction.makePrediction(dataVector), locationId);
        var predictItem = {
          date: moment(dateMoment).toDate(),
          quantity: quantity,
          updateAt: today,
          menuItemId: item._id,
          relations: item.relations
        };

        var currentData = SalesPrediction.findOne({
          date: TimeRangeQueryBuilder.forDay(dateMoment),
          menuItemId: predictItem.menuItemId
        });
        //checking need for notification push
        if (i < 14 && currentData) {
          if (currentData) {
            if (currentData.quantity != predictItem.quantity) {
              var itemName = MenuItems.findOne({_id: predictItem.menuItemId}).name;
              notification.add(dateMoment.toDate(), itemName, currentData.quantity, predictItem.quantity);
            }
          }
        }

        SalesPrediction.update({
          date: TimeRangeQueryBuilder.forDay(predictItem.date),
          menuItemId: predictItem.menuItemId
        }, predictItem, {upsert: true});

      });

      var receiversIds = [];
      Meteor.users.find({'relations.areaIds': area._id}).map(function (user) {
        if (user.roles[area._id] === roleManagerId){
          receiversIds.push(user._id);
        }
      });
      notification.send(receiversIds, area._id);

    });

    dateMoment.add(1, "day");
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

  /* testing send notification
  locations.forEach(function (location) {
    predict(1, location._id);
  });
  */

  locations.forEach(function (location) {
    if (HospoHero.prediction.isAvailableForLocation(location)) {
      var lastUpdates = ForecastDates.findOne({locationId: location._id});

      var needFullUpdate = !lastUpdates || !lastUpdates.lastThreeDays
        || todayMoment.diff(lastUpdates.lastSixWeeks) >= HospoHero.getMillisecondsFromDays(42);

      if (needFullUpdate) {
        predict(84, location._id);
        updateForecastDate(location._id, ['lastSixWeeks', 'lastThreeDays'], todayMoment.toDate());

      } else if (todayMoment.diff(lastUpdates.lastThreeDays) >= HospoHero.getMillisecondsFromDays(3)) {
        predict(7, location._id);
        updateForecastDate(location._id, 'lastThreeDays', todayMoment.toDate());

      } else if (todayMoment.diff(lastUpdates.lastThreeDays) >= HospoHero.getMillisecondsFromDays(3)) {
        predict(2, location._id);
      }
    }
  });
};

SyncedCron.add({
  name: 'Forecast refresh',
  schedule: function (parser) {
    return parser.text('at 05:00 am');
  },
  job: salesPredictionUpdateJob
});


Meteor.startup(function () {
  //if we run first time -> make predictions immediately (in other thread)

  Meteor.setTimeout(salesPredictionUpdateJob, 0);

});



