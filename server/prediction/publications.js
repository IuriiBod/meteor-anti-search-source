Meteor.publish("salesPrediction", function(year, week) {
    var monday = moment(getFirstDateOfISOWeek(week, year));
    var sunday = moment(monday).add(6, "d");
    return SalesPrediction.find({date:{$gte: monday.toDate(), $lte: sunday.endOf("d").toDate()}});
});