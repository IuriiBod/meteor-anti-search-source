var subs = new SubsManager();

var component = FlowComponents.define("cafeSalesForecastPerDay", function(props) {
  this.day = props.day;
  subs.subscribe("allCategories");
});

component.state.day = function() {
  this.set("day", this.day._id);
  return this.day._id;
}

component.state.categories = function() {
  return Categories.find();
}

component.state.expectedRevenue = function() {
  var day = this.get("day");
  var cafeForecast = ForecastCafe.findOne({"_id": day});
  if(cafeForecast) {
    return cafeForecast.revenue;
  } else {
    return 0;
  }
}