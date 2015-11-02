var component = FlowComponents.define("staffCostPercentageFigureBox", function (props) {
  var figureBox = props.figureBox;
  this.wages = figureBox.getWages();
  this.percentDoc = figureBox.getPercentDocs();
});

component.state.weeklyStaffWage = function () {
  return this.wages.actual.toFixed(2);
};

component.state.rosteredStaffWage = function () {
  return this.wages.forecasted.toFixed(2);
};

component.state.percent = function () {
  return this.percentDoc.wage;
};