Meteor.publish("salesPrediction", function(year, week) {
    var monday = moment(getFirstDateOfISOWeek(week, year));
    return SalesPrediction.find({date:TimeRangeQueryBuilder.forWeek(monday)});
});

Meteor.publish("importedActualSales", function () {
    return ImportedActualSales.find();
})