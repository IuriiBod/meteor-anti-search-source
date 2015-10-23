var component = FlowComponents.define("salesFigureBox", function (props) {
  this.actual = props.actual;
  this.forecasted = props.forecasted;
  this.figureBox = new FigureBox();
});

component.state.weeklySale = function () {
  return !isNaN(this.actual)?parseInt(this.actual).toLocaleString():0;
};

component.state.forecastedSale = function () {
  return !isNaN(this.forecasted)?this.forecasted.toFixed(2):0;
};

component.state.percent = function () {
  return this.figureBox.percent(this.actual,this.forecasted);

};
