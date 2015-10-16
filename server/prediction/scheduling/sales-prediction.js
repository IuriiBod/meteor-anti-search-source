var predict = function (days, locationId) {
  var today = new Date();
  var dateMoment = moment();
  var prediction = new GooglePredictionApi(locationId);
  var items = MenuItems.find({"relations.locationId": locationId}, {});
  var notification = new Notification();
  //forecast for 15 days
  OpenWeatherMap.updateWeatherForecastForLocation(locationId);

  var currentWeather;
  for (var i = 1; i <= days; i++) {
    var dayOfYear = dateMoment.dayOfYear();

    if (i < 16) {
      currentWeather = WeatherForecast.findOne({locationId: locationId, date: TimeRangeQueryBuilder.forDay(today)});
    } else {
      //todo: temporal. figure out typical weather
      currentWeather = {
        main: "Clear",
        temp: 20.0
      }
    }

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

      //checking need for notification push
      if (i < 14 && currentData) {
        if (currentData) {
          var currentData = SalesPrediction.findOne({
            date: TimeRangeQueryBuilder.forDay(dateMoment),
            menuItemId: predictItem.menuItemId
          });
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

    dateMoment.add(1, "day");
  }

  //todo: find managers of current area to send them it
  //var receiversIds = Meteor.users.find({isAdmin: true}).fetch().map(function (user) {
  //  return user._id;
  //});
  //notification.send(receiversIds);
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
  var locations = Locations.find({archived:{$ne:true}});

  var todayMoment = moment();

  locations.forEach(function (location) {
    if (HospoHero.prediction.isAvailableForLocation(location)) {
      var lastUpdates = ForecastDates.findOne({locationId: location._id});

      var needFullUpdate = !lastUpdates || !lastUpdates.lastThree
        || todayMoment.diff(lastUpdates.lastSixWeeks) >= HospoHero.getMillisecondsFromDays(42);

      if (needFullUpdate) {
        predict(84, location._id);
        updateForecastDate(location._id, ['lastSixWeeks', 'lastThree'], todayMoment.toDate());

      } else if (todayMoment.diff(lastUpdates.lastThree) >= HospoHero.getMillisecondsFromDays(3)) {
        predict(7, location._id);
        updateForecastDate(location._id, 'lastThree', todayMoment.toDate());

      } else if (todayMoment.diff(lastUpdates.lastThree) >= HospoHero.getMillisecondsFromDays(3)) {
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



