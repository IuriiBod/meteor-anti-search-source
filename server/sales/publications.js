Meteor.publish("salesOnDate", function(date) {
  if(this.userId) {
    var query = { "date": new Date(date).getTime() };
    var user = Meteor.users.findOne({_id: this.userId});
    if(user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }
    return Sales.find(query, {limit: 10});
  }
});

Meteor.publish("salesForecastOnDate", function(date) {
  if(this.userId) {
    var query = { "date": new Date(date).getTime() };
    var user = Meteor.users.findOne({_id: this.userId});
    if(user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }
    return SalesForecast.find(query, {limit: 10});
  }
});

Meteor.publish("salesCalibration", function() {
  if(this.userId) {
    var query = {};
    var user = Meteor.users.findOne({_id: this.userId});
    if (user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }
    return SalesCalibration.find(query);
  }
});

Meteor.publish("forecastPerWeek", function(firstDate, lastDate) {
  if(this.userId) {
    var query = {
      "date": {
        $gte: firstDate,
        $lte: lastDate
      }
    };
    var user = Meteor.users.findOne({_id: this.userId});
    if (user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }
    logger.info("Forecast per week publication");
    return ForecastCafe.find(query, { sort: {"date": 1} });
  }
});
