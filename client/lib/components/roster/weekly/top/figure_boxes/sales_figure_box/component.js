var component = FlowComponents.define("salesFigureBox", function (props) {
  this.actual = props.actual;
  this.forecasted = props.forecasted;

  this.onRendered(this.itemRendered);
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

component.prototype.itemRendered = function () {
  this.$('[data-toggle="popover"]').popover({
    content: "The figure shows the actual sales result from the days in the past plus the forecast sales" +
    " for the rest of the week. So you can see if you're on track."
  });
};