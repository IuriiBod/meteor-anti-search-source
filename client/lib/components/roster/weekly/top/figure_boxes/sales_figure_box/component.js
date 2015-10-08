var component = FlowComponents.define("salesFigureBox", function (props) {
  this.actual = props.actual;
  this.forecasted = props.forecasted;
});

component.state.weeklySale = function () {
  return parseInt(this.actual).toLocaleString();
};

component.state.forecastedSale = function () {
  return this.forecasted.toFixed(2);
};

component.state.percent = function () {
  var actual = this.actual;
  var forecasted = this.forecasted;
  var diff = 0;
  var doc = {
    "value": 0,
    "textColor": "text-navy",
    "icon": "fa-angle-up"
  };

  diff = parseFloat(actual) - parseFloat(forecasted);
  doc.value = ((diff / parseFloat(forecasted)) * 100).toFixed(2);
  if (diff < 0) {
    doc.textColor = "text-danger";
    doc.icon = "fa-angle-down";
  }
  return doc;
};
