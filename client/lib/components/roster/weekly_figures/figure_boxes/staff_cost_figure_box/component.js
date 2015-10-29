var component = FlowComponents.define("staffCostFigureBox", function (props) {
  var figureBox = props.figureBox;
  this.staff = figureBox.getStaff();
  this.percentDoc = figureBox.getPercentDocs();
});

component.state.weeklyStaffCost = function () {
  return this.staff.actual.toFixed(2);
};

component.state.percent = function () {
  return this.percentDoc.staff;
};

component.state.rosteredStaffCost = function () {
  return this.staff.forecasted.toFixed(2);
};