var component = FlowComponents.define("staffCostTr", function (props) {
  var figureBoxDataHelper = props.figureBoxDataHelper;
  this.dailyStaff = figureBoxDataHelper.getDailyStaff(props.day);
});

component.state.actual = function () {
  return Math.round(this.dailyStaff.actual).toLocaleString();
};

component.state.forecast = function () {
  return Math.round(this.dailyStaff.forecasted).toLocaleString();
};

component.state.textClass = function () {
  if (this.dailyStaff.actual && this.dailyStaff.forecasted) {
    if (this.dailyStaff.actual <= this.dailyStaff.forecasted) {
      return "text-info";
    } else {
      return "text-danger";
    }
  }
};