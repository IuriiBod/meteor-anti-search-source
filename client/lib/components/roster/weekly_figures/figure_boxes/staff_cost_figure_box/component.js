var component = FlowComponents.define("staffCostFigureBox", function (props) {
  this.actual = props.actual;
  this.forecasted = props.forecasted;
  var data = {
    declining: props.forecasted,
    subtrahend: props.actual
  };
  this.figureBox = new FigureBoxDataHelper(data);
});

component.state.weeklyStaffCost = function () {
  return this.actual.toFixed(2);
};

component.state.percent = function () {
  return this.figureBox.percent();
};

component.state.rosteredStaffCost = function () {
  return this.forecasted.toFixed(2);
};