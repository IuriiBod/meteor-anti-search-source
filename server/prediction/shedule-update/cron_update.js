Meteor.startup(function(){
  SyncedCron.add({
    name: 'Forecast refresh',
    schedule: function(parser) {
    return parser.text('at 05:00 am');
    },
    job: function() {
      var date = moment();

      if(!ForecastDates.findOne({locationId: 1})) {
        ForecastDates.insert({locationId: 1, lastThree: date.format(), lastSixWeeks: date.format()});
        predict(84);

      }
      else {
        var lastUpdates = ForecastDates.findOne({locationId:1});

        if (date.diff(lastUpdates.lastSixWeeks) >= 1000*60*60*24*42) {
          predict(84);
          ForecastDates.update({locationId: 1}, {$set:{lastSixWeeks: date.format(), lastThree: date.format() }});
        }else if(date.diff(lastUpdates.lastThree) >= 1000*60*60*24*3) {
          predict(7);
          ForecastDates.update({locationId: 1}, {$set:{lastThree: date.format()}});
        }
        else{
          predict(2);
        }
      }
    }
  });

  SyncedCron.start();
});

function predict (days){
  var date = moment().format();
  var updateDay = moment().format();
  var prediction = PredictionApi.auth();
  var Items = MenuItems.find({},{fields:{_id: 1}}).fetch();
  var notificationText = [];

  for(var i = 1; i<=days; i++ ) {
    var weather = OpenWeatherMap.historyMock();                             //here will be weather for day we need
    var dayOfYear = parseInt(moment(updateDay).format("DDD"));
    updateDay = moment(updateDay).add(1, "d").format();

    _.each(Items, function(item){                                        
      var dataVector = [item._id, weather.temp, weather.main, dayOfYear];
      var quantity = parseInt(prediction.predict("trainingModel", dataVector).outputValue);

      var predictItem = {
        date: moment(updateDay).format("YYYY-MM-DD"),
        quantity: quantity,
        updateAt: date,
        menuItemId: item._id
      };

      var currentData = SalesPrediction.findOne({date: predictItem.date, menuItemId: predictItem.menuItemId});
      if (i<14 && currentData){
        if (currentData.quantity != predictItem.quantity)
        {
          var itemName = MenuItems.findOne({_id: predictItem.menuItemId}).name;
          notificationText.push("<li>" + predictItem.date + ":" + itemName + ": from " + currentData.quantity + " to " + predictItem.quantity + "</li>");
        }
      }
      SalesPrediction.update({date: predictItem.date, menuItemId: predictItem.menuItemId},predictItem, {upsert:true});
    });
  }
  if (notificationText.length != 0)
  {
    notificationText.push("</ul>");
    notificationText.unshift("<ul>");
    var receivers = Meteor.users.find({isManager: true}).fetch();
    var options = {
      type: 'prediction',
      read: false,
      title: 'Some predictions have been changed',
      createdBy: null,
      text: notificationText.join(''),
      actionType: 'update'
    };
    _.each(receivers, function (item){
      options.to = item._id;
      Notifications.insert(options);
    });

  }
}