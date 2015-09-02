Meteor.publish("actualSalesForWeek", function(start, end, department) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var query = {
    "department": department
  };
  
  var cursors = [];
  if(start && end) {
    query = {"date": {$gte: new Date(start).getTime(), $lte: new Date(end).getTime()}};
  }
  var salesCursor = ActualSales.find(query, {sort: {"date": 1}});
  cursors.push(salesCursor);
  logger.info("Actual sales for department " + department + " has been published");
  return cursors;
});

Meteor.publish("salesForecastForWeek", function(start, end, department) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var query = {
    "department": department
  };
  
  var cursors = [];
  if(start && end) {
    query = {"date": {$gte: new Date(start).getTime(), $lte: new Date(end).getTime()}};
  }
  var forecastCursor = SalesForecast.find(query, {sort: {"date": 1}});
  cursors.push(forecastCursor);
  logger.info("Sales forecast for department " + department + " has been published");
  return cursors;
});