Meteor.publish("salesPrediction", function(year, week) {
    var monday = getFirstDateOfISOWeek(week, year);
    var dates =_.map(getDaysOfWholeWeek(monday), function(item){
        return item.date;
    });
    dates.push(moment(dates[dates.length-1]).add(1, "d").format("YYYY-MM-DD"));
    return SalesPrediction.find({date:{$in: dates}});
});