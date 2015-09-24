Meteor.startup(function(){
  SyncedCron.add({
    name: 'Forecast refresh',
    schedule: function(parser) {
    return parser.text('at 11:31 am');
    },
    job: function() {
      var date = moment();

      if(!ForecastDates.findOne({locationId: 1})) {
        ForecastDates.insert({locationId: 1, lastThree: date.format(), lastSixWeeks: date.format()});
        predict(31);

      }
      else {
        var lastUpdates = ForecastDates.findOne({locationId:1});

        if (date.diff(lastUpdates.lastSixWeeks) >= 1000*60*60*24*42) {
          predict(84);
          console.log(date.diff(lastUpdates.lastSixWeeks));
          console.log("6 weeks prediction");
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

  for(var i = 1; i<=days; i++ ) {
    var weather = OpenWeatherMap.historyMock();                             //here will be weather for day we need
    var dayOfYear = parseInt(moment(updateDay).format("DDD"));
    updateDay = moment(updateDay).add(1, "d").format();

    _.each(Items, function(item){                                        
      var dataVector = [item._id, weather.temp, weather.main, dayOfYear];
      var quantity = prediction.predict("trainingModel", dataVector);

      var predictItem ={
        date: moment(updateDay).format("YYYY-MM-DD"),
        quantity: parseInt(quantity.outputValue),
        updateAt: date,
        menuItemId: item._id
      };
      SalesPrediction.insert(predictItem);
    });
  }
}