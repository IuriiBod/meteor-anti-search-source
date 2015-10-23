var component = FlowComponents.define("salesFigureBox", function (props) {
  this.actual = props.actual;
  this.forecasted = props.forecasted;
  this.figureBox = new FigureBox();
});

component.state.weeklySale = function () {
  return parseInt(this.actual).toLocaleString();
};

component.state.forecastedSale = function () {
  return this.forecasted.toFixed(2);
};

component.state.percent = function () {
  return this.figureBox.percent(this.actual,this.forecasted);

};
