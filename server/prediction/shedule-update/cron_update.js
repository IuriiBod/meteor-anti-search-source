Meteor.startup(function(){
  SyncedCron.add({
    name: 'Forecast refresh',
    schedule: function(parser) {
    return parser.text('at 5:00 am');
    },
    job: function() {
      var date = new Date();

      if(!ForecastDates.findOne()) {
        predict(1);
        predict(3);
        predict(42);
        ForecastDates.insert({LastThree: date, LastSixWeeks: date, ID: 1});
      }
      else {
        var lastUpdates = ForecastDates.findOne();

        if (Math.abs(date - lastUpdates.LastSixWeeks) >= 1000*60*60*24*42) {
          predict(42);
          ForecastDates.update({ID: 1}, {$set:{LastThree: date, LastSixWeeks: date}});
        }else if(Math.abs(date - lastUpdates.LastThree) >= 1000*60*60*24*3 ) {
          predict(3);
          ForecastDates.update({ID: 1}, {$set:{LastThree: date}});
        }
        else{
          predict(1);
        }
      }
    }
  });

  SyncedCron.start();
});

function predict (days){
  var result = [];                                                          
  var date = new Date();
  var updateDay = new Date();
  var prediction = PredictionApi.auth();
  var Items = MenuItems.find({},{fields:{_id: 1}});

  for(var i = 1; i<=days; i++ ) {
    var weather = OpenWeatherMap.historyMock();                             //here will be weather for day we need
    var dayOfYear = parseInt(moment(updateDay).format("DDD"));
    updateDay = moment(updateDay).add(1, "d").format();

    _.each(Items, function(item){                                        
      var dataVector = [item._id, weather.temp, weather.main, dayOfYear];
      var quantity = prediction.predict("trainingModel", dataVector);

      var predictItem ={
        date: updateDay,
        quantity: parseInt(quantity.outputValue),
        updateAt: date,
        menuItemId: item._id
      }
      SalesPrediction.insert(predictItem);
    });
  }
}