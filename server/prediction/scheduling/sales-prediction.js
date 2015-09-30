//todo: add cron job for sales prediction updating
var currentLocationId = 1;


var predict = function (days) {
  var updatedAt = new Date();
  var dateMoment = moment();
  var prediction = new GooglePredictionApi();
  var items = MenuItems.find({}, {fields: {_id: 1}}).fetch();
  var notification = new Notification();

  //forecast for 15 days
  //todo: put real location
  var weatherForecast = OpenWeatherMap.forecast(Meteor.settings.Location);
  var currentWeather;
  for (var i = 1; i <= days; i++) {
    var dayOfYear = dateMoment.dayOfYear();

    if (i < 16) {
      currentWeather = _.find(weatherForecast, function (dailyForecast) {
        return dailyForecast.date === dateMoment.format('YYYY-MM-DD');
      });
    } else {
      //todo: temporal. figure out typical weather
      currentWeather = {
        main: "Clear",
        temp: 20.0
      }
    }

    _.each(items, function (item) {
      var dataVector = [item._id, currentWeather.temp, currentWeather.main, dayOfYear];
      var quantity = parseInt(prediction.makePrediction(dataVector));
      var predictItem = {
        date: moment(dateMoment).toDate(),
        quantity: quantity,
        updateAt: updatedAt,
        menuItemId: item._id
      };

      //checking need for notification push
      var currentData = SalesPrediction.findOne({
        date: {$gt: moment(dateMoment).startOf('day').toDate(), $lt: moment(dateMoment).endOf('day').toDate()},
        menuItemId: predictItem.menuItemId
      });
      //console.log(moment(dateMoment).startOf('day').toDate(), moment(dateMoment).endOf('day').toDate());
      if (i < 14 && currentData) {
        if (currentData.quantity != predictItem.quantity) {
          var itemName = MenuItems.findOne({_id: predictItem.menuItemId}).name;
          notification.add(dateMoment.toDate(), itemName, currentData.quantity, predictItem.quantity);
        }
      }
      SalesPrediction.update(
        {
          date: {
            $gt: moment(predictItem.date).startOf('day').toDate(),
            $lt: moment(predictItem.date).endOf('day').toDate()
          },
          menuItemId: predictItem.menuItemId
        },
        predictItem,
        {upsert: true}
      );
    });

    dateMoment.add(1, "day");
  }

  var receiversIds = Meteor.users.find({isAdmin: true}).fetch().map(function (user) {
    return user._id;
  });
  notification.send(receiversIds);
};


var salesPredictionUpdateJob = function () {
  var date = moment();

  if (!ForecastDates.findOne({locationId: currentLocationId})) {
    ForecastDates.insert({locationId: currentLocationId, lastThree: date.toDate(), lastSixWeeks: date.toDate()});
    predict(84);
  }
  else {
    var lastUpdates = ForecastDates.findOne({locationId: currentLocationId});
    if (!ForecastDates.findOne({locationId: currentLocationId}).lastThree) {
      predict(84);
    }
    else {
      if (date.diff(lastUpdates.lastSixWeeks) >= getMillisecondsFromDays(42)) {
        predict(84);
        ForecastDates.update({locationId: currentLocationId}, {
          $set: {
            lastSixWeeks: date.toDate(),
            lastThree: date.toDate()
          }
        });
      } else if (date.diff(lastUpdates.lastThree) >= getMillisecondsFromDays(3)) {
        predict(7);
        ForecastDates.update({locationId: currentLocationId}, {$set: {lastThree: date.toDate()}});
      }
      else {

        predict(2);
      }
    }
  }
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
  //todo: add search by location id later
  if (SalesPrediction.find().count() === 0) {
    Meteor.setTimeout(salesPredictionUpdateJob, 0);
  }
});



