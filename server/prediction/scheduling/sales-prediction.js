//todo: add cron job for sales prediction updating
var TEMP_LOCATION_ID = 1;

SyncedCron.add({
    name: 'Forecast refresh',
    schedule: function(parser) {
        return parser.text('at 05:00 am');
    },
    job: function() {
        var date = moment();

        if(!ForecastDates.findOne({locationId: TEMP_LOCATION_ID})) {
            ForecastDates.insert({locationId: TEMP_LOCATION_ID, lastThree: date.toDate(), lastSixWeeks: date.toDate()});
            predict(84);

        }
        else {
            var lastUpdates = ForecastDates.findOne({locationId:1});

            if (date.diff(lastUpdates.lastSixWeeks) >= getMillisecondsFromDays(42)) {
                predict(84);
                ForecastDates.update({locationId: TEMP_LOCATION_ID}, {$set:{lastSixWeeks: date.toDate(), lastThree: date.toDate() }});
            }else if(date.diff(lastUpdates.lastThree) >= getMillisecondsFromDays(3)) {
                predict(7);
                ForecastDates.update({locationId: TEMP_LOCATION_ID}, {$set:{lastThree: date.toDate()}});
            }
            else{
                predict(2);
            }
        }
    }
});

function predict (days){
    var updatedAt = new Date();
    var dateMoment = moment();
    var prediction = new GooglePredictionApi();
    var items = MenuItems.find({},{fields:{_id: 1}}).fetch();
    var notification = new Notification();

    for(var i = 1; i<=days; i++ ) {
        var weather = OpenWeatherMap.historyMock();                             //here will be weather for day we need
        var dayOfYear = dateMoment.dayOfYear();
        dateMoment.add(1, "d");

        _.each(items, function(item){
            var dataVector = [item._id, weather.temp, weather.main, dayOfYear];
            var quantity = parseInt(prediction.makePrediction(dataVector));

            var predictItem = {
                date: dateMoment.format("YYYY-MM-DD"),
                quantity: quantity,
                updateAt: updatedAt,
                menuItemId: item._id
            };

            //checking need for notification push
            var currentData = SalesPrediction.findOne({date: predictItem.date, menuItemId: predictItem.menuItemId});
            if (i<14 && currentData){
                if (currentData.quantity != predictItem.quantity)
                {
                    var itemName = MenuItems.findOne({_id: predictItem.menuItemId}).name;
                    notification.add(predictItem.date, itemName, currentData.quantity, predictItem.quantity);
                }
            }

            SalesPrediction.update({date: predictItem.date, menuItemId: predictItem.menuItemId},predictItem, {upsert:true});
        });
    }
    notification.send();
}

function getMillisecondsFromDays (days){
    return 1000*60*60*24*days
}