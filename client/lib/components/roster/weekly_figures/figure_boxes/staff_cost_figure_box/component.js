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
  return !isNaN(this.actual) ? this.actual.toFixed(2) : 0;
};

component.state.percent = function () {
  return this.figureBox.percent();
};

component.state.rosteredStaffCost = function () {
  return !isNaN(this.forecasted) ? this.forecasted.toFixed(2) : 0;
};