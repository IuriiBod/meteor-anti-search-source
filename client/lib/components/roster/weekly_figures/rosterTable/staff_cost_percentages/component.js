var component = FlowComponents.define("staffCostPercentagesTr", function (props) {
  var figureBoxDataHelper = props.figureBoxDataHelper;
  this.dailyStaff = figureBoxDataHelper.getDailyStaff(props.day);
});

component.state.actual = function () {
  return this.dailyStaff.actualWage;
};

component.state.forecast = function () {
  return this.dailyStaff.forecastedWage;
};

component.state.textClass = function () {
  if (this.dailyStaff.actualWage != 0) {
    if (this.dailyStaff.actualWage <= this.dailyStaff.forecastedWage) {
      return "text-info";
    } else {
      return "text-danger";
    }
  }
};