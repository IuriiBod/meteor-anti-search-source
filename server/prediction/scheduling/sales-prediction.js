var predict = function (days, locationId) {
  var today = new Date();
  var dateMoment = moment();
  var prediction = new GooglePredictionApi();
  var items = MenuItems.find({"relations.locationId":locationId}, {fields: {_id: 1}}).fetch();
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

    _.each(items, function (item) {
      var dataVector = [item._id, currentWeather.temp, currentWeather.main, dayOfYear];
      var quantity = parseInt(prediction.makePrediction(dataVector), locationId);
      var predictItem = {
        date: moment(dateMoment).toDate(),
        quantity: quantity,
        updateAt: today,
        menuItemId: item._id
      };

      //checking need for notification push
      var currentData = SalesPrediction.findOne({
        date: TimeRangeQueryBuilder.forDay(dateMoment),
        menuItemId: predictItem.menuItemId
      });
      if (i < 14 && currentData) {
        if (currentData.quantity != predictItem.quantity) {
          var itemName = MenuItems.findOne({_id: predictItem.menuItemId}).name;
          notification.add(dateMoment.toDate(), itemName, currentData.quantity, predictItem.quantity);
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


var salesPredictionUpdateJob = function () {
  var locations = Locations.find({},{_id: 1}).fetch();

  var date = moment();
  _.each(locations, function (location) {
    if (!ForecastDates.findOne({locationId: location._id})) {
      ForecastDates.insert({locationId: location._id, lastOne:date.toDate(), lastThree: date.toDate(), lastSixWeeks: date.toDate()});
      predict(84, location._id);
    }
    else {
      var lastUpdates = ForecastDates.findOne({locationId: location._id});
      if (!ForecastDates.findOne({locationId: location._id}).lastThree) {
        predict(84, location._id);
      }
      else {
        if (date.diff(lastUpdates.lastSixWeeks) >= HospoHero.getMillisecondsFromDays(42)) {
          predict(84, location._id);
          ForecastDates.update({locationId: location._id}, {
            $set: {
              lastSixWeeks: date.toDate(),
              lastThree: date.toDate()
            }
          });
        } else if (date.diff(lastUpdates.lastThree) >= HospoHero.getMillisecondsFromDays(3)) {
          predict(7, location._id);
          ForecastDates.update({locationId: location._id}, {$set: {lastThree: date.toDate()}});
        }
        else if (date.diff(lastUpdates.lastThree) >= HospoHero.getMillisecondsFromDays(3)) {
          predict(2, location._id);
          ForecastDates.update({locationId: location._id}, {$set: {lastOne: date.toDate()}});
        }
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



