var component = FlowComponents.define("staffCostPercentageFigureBox", function (props) {
  this.actualSales = props.actualSales;
  this.forecastedSales = props.forecastedSales;
  this.actualStaff = props.actualStaff;
  this.forecastedStaff = props.forecastedStaff;
});

component.state.weeklyStaffWage = function () {
  var actual = 0;
  if(this.actualSales != 0){
    actual = ((this.actualStaff / this.actualSales) * 100);
  }
  this.set("actualWage", actual);
  return actual.toFixed(2);
};

component.state.rosteredStaffWage = function () {
  var forecasted = 0;
  if(this.forecastedSales != 0){
    forecasted = ((this.forecastedStaff / this.forecastedSales) * 100);
  }
  this.set("forecastedWage", forecasted);
  return forecasted.toFixed(2);
};

component.state.percent = function () {
  var figureBox = new FigureBoxDataHelper({
    declining: this.get("forecastedWage"),
    subtrahend: this.get("actualWage")
  });
  return figureBox.percent();
};