Meteor.publish("salesOnDate", function(date) {
  if(this.userId) {
    var query = {
      "date": new Date(date).getTime(),
      "relations.areaId": HospoHero.currentArea(this.userId)
    };
    return Sales.find(query, {limit: 10});
  }
});

Meteor.publish("salesForecastOnDate", function(date) {
  if(this.userId) {
    var query = {
      "date": new Date(date).getTime(),
      "relations.areaId": HospoHero.currentArea(this.userId)
    };
    return SalesForecast.find(query, {limit: 10});
  }
});

Meteor.publish("salesCalibration", function() {
  if(this.userId) {
    return SalesCalibration.find({
      "relations.areaId": HospoHero.currentArea(this.userId)
    });
  }
});

Meteor.publish("forecastPerWeek", function(firstDate, lastDate) {
  if(this.userId) {
    var query = {
      "date": {
        $gte: firstDate,
        $lte: lastDate
      },
      "relations.areaId": HospoHero.currentArea(this.userId)
    };
    logger.info("Forecast per week publication");
    return ForecastCafe.find(query, { sort: {"date": 1} });
  }
});
