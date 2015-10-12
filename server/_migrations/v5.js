Migrations.add({
    version: 5,
    name: "Location configuration in collections",
    up: function (){
        ImportedActualSales.remove({});
        SalesPrediction.remove({});
        ForecastDates.remove({});
        var locations = Locations.find().fetch();
        var query={};
        _.each(locations, function (location) {
            if(!location.city || !location.country){
                query.country = "AU";
                query.city = "Sydney";
                query.address = "some address";
            }
            if(!location.pos){
                query.pos = {
                  key: "",
                  secret: "",
                  host:""
                };
            }
            query.openingTime = moment({hours:8, minutes:0}).toDate();
            query.closingTime = moment({hours:17, minutes:0}).toDate();
            Locations.update({_id:location._id}, {$set:query, $unset:{status:""}});
        });
        Areas.update({}, {$unset:{status:""}}, {multi: true});
    }
});