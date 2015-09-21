Meteor.startup(function(){
  SyncedCron.add({
    name: 'Forecast refresh',
    schedule: function(parser) {
    return parser.text('every 15 sec');
    },
    job: function() {
      var date = new Date();
      if(!ForecastDates.findOne()) {
        
        ForecastDates.insert({LastThree: date, LastSixWeeks: date, ID: 1});
        EveryDayUpdate();
        UpdateThree();
        UpdateSixWeeks();
      }
      else {
        EveryDayUpdate();
        var lastUpdates = ForecastDates.findOne();
        if(Math.abs(date - lastUpdates.LastThree) >= 29000 ) {
          UpdateThree();
          ForecastDates.update({ID: 1}, {$set:{LastThree: date}});
        }
        if (Math.abs(date - lastUpdates.LastSixWeeks) >= 59000) {
          UpdateSixWeeks();
          ForecastDates.update({ID: 1}, {$set:{LastSixWeeks: date}});
        }
      }
      
    }
  });

  SyncedCron.start();
});

function EveryDayUpdate() {
  console.log("Every Day Update activated");
}

function UpdateThree () {
  console.log("3 Days Update activated");
}

function UpdateSixWeeks () {
  console.log("6 Weeks Update activated");
}