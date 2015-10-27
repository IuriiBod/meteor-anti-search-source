var component = FlowComponents.define("staffCostPercentagesTr", function(props) {
  this.dayObj = props.day;
  this.figureBox = new FigureBoxDataHelper(this.dayObj);
});

component.state.actual = function() {
  var actual = this.figureBox.getDailyActual();
  var percentage = 0;
  if(actual.actualSales > 0) {
    percentage = (actual.actualWages/actual.actualSales);
  }
  percentage = percentage * 100;
  this.set("actualStaffCostPercentage", percentage);
  return percentage;
};

component.state.forecast = function() {
  var forecasted = this.figureBox.getDailyForecast();

  var percentage = 0;
  if(forecasted.forecastedSales> 0) {
    percentage = (forecasted.forecastedWages/forecasted.forecastedSales);
  }
  percentage = percentage * 100;
  this.set("forecastedStaffCostPercentage", percentage);
  return percentage;
};

component.state.class = function() {
  var actual = this.get("actualStaffCostPercentage");
  var forecast = this.get("forecastedStaffCostPercentage");
  if(actual && forecast) {
    if(actual <= forecast) {
      return "text-info";
    } else {
      return "text-danger";
    }
  }
};