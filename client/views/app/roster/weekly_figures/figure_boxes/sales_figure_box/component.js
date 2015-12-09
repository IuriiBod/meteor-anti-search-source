var component = FlowComponents.define("salesFigureBox", function (props) {
  var figureBox = props.figureBox;
  this.sales = figureBox.getSales();
  this.percentDoc = figureBox.getPercentDocs();
});

component.state.weeklySale = function () {
  return parseInt(this.sales.actual).toLocaleString();
};

component.state.forecastedSale = function () {
  return this.sales.forecasted.toFixed(2);
};

component.state.percent = function () {
  return this.percentDoc.sales;
};
