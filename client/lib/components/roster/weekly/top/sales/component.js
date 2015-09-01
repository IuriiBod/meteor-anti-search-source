var component = FlowComponents.define("salesTr", function(props) {
  this.dayObj = props.day;
  console.log("....props", this.dayObj);
  this.onRendered(this.onItemRendered);
});

component.state.doc = function() {
  return this.dayObj;
}

component.prototype.onItemRendered = function() {
  $(".editableSalesForecast").editable({
    type: "text",
    title: 'Edit Forecast',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function(value, response) {
    },
    success: function(response, newValue) {
      var date = $(this).attr("data-date");
      console.log(date);
      Meteor.call("salesForecastCafe", date, parseFloat(newValue), function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });
}