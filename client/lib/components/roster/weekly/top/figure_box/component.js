var component = FlowComponents.define("figureBox", function(props) {
  this.name = props.name;
  this.subText = props.subtext;
  this.dataContent = props.dataContent;
  this.onRendered(this.itemRendered);
});

component.state.item = function() {
  return this;
}

component.state.actualCost = function() {
  var total = 0;
  if(this.name == "Sales") {
    var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
    var query = {
      "department": "cafe"
    };
    
    var cursors = [];
    if(week.monday && week.sunday) {
      query = {"date": {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()}};
    }
    var sales = ActualSales.find(query, {sort: {"date": 1}}).fetch();
    if(sales && sales.length > 0) {
      sales.forEach(function(doc) {
        total += doc.revenue;
      });
    }
  }
  return total;
}

component.state.forecastedCost = function() {
  var total = 0;
  if(this.name == "Sales") {
    var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
    var query = {
      "department": "cafe"
    };
    
    var cursors = [];
    if(week.monday && week.sunday) {
      query = {"date": {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()}};
    }
    var sales = SalesForecast.find(query, {sort: {"date": 1}}).fetch();
    if(sales && sales.length > 0) {
      sales.forEach(function(doc) {
        total += doc.forecastedRevenue;
      });
    }
  }
  return total;
}

component.prototype.itemRendered = function() {
  $('[data-toggle="popover"]').popover()
}