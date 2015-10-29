var component = FlowComponents.define("staffCostTr", function (props) {
  this.dayObj = props.day;
  this.figureBoxDataHelper = props.figureBoxDataHelper;
  this.dailyStaff = this.figureBoxDataHelper.getDailyStaff(this.dayObj);
});

component.state.actual = function () {
  return Math.round(this.dailyStaff.actual).toLocaleString();
};

component.state.forecast = function () {
  return Math.round(this.dailyStaff.forecasted).toLocaleString();
};

component.state.class = function () {
  if (this.dailyStaff.actual && this.dailyStaff.forecasted) {
    if (this.dailyStaff.actual <= this.dailyStaff.forecasted) {
      return "text-info";
    } else {
      return "text-danger";
    }
  }
};