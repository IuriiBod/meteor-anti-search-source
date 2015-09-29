//todo: add cron job for sales prediction updating
var currentLocationId = 1;

var predict = function (days) {
  var updatedAt = new Date();
  var dateMoment = moment();
  var prediction = new GooglePredictionApi();
  var items = MenuItems.find({}, {fields: {_id: 1}}).fetch();
  var notification = new Notification();

  for (var i = 1; i <= days; i++) {
    var dayOfYear = dateMoment.dayOfYear();
    dateMoment.add(1, "d");
    var weather = OpenWeatherMap.history(dateMoment.toDate(), 'todo: specify location here like "Ternopil,UK"');                             //here will be weather for day we need

    _.each(items, function (item) {
      var dataVector = [item._id, weather.temp, weather.main, dayOfYear];
      var quantity = parseInt(prediction.makePrediction(dataVector));
      var predictItem = {
        date: dateMoment.toDate(),
        quantity: quantity,
        updateAt: updatedAt,
        menuItemId: item._id
      };

      //checking need for notification push
      var currentData = SalesPrediction.findOne({
        date: {$gt: dateMoment.startOf('day').toDate(), $lt: dateMoment.endOf('day').toDate()},
        menuItemId: predictItem.menuItemId
      });

      if (i < 14 && currentData) {
        if (currentData.quantity != predictItem.quantity) {
          var itemName = MenuItems.findOne({_id: predictItem.menuItemId}).name;
          notification.add(dateMoment.toDate(), itemName, currentData.quantity, predictItem.quantity);
        }
      }
      SalesPrediction.update({date: predictItem.date, menuItemId: predictItem.menuItemId}, predictItem, {upsert: true});
    });
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
    return parser.text('at 12:56 pm');
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



