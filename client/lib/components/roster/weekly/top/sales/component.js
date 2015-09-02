var component = FlowComponents.define("salesTr", function(props) {
  this.dayObj = props.day;
  this.onRendered(this.onItemRendered);
});

component.state.doc = function() {
  return this.dayObj;
}

component.state.forecast = function() {
  var salesForecast = SalesForecast.findOne({"date": new Date(this.dayObj.date).getTime(), "department": "cafe"});
  if(salesForecast) {
    return salesForecast;
  }
}

component.state.sales = function() {
  var sales = ActualSales.findOne({"date": new Date(this.dayObj.date).getTime(), "department": "cafe"});
  if(sales) {
    return sales;
  }
}

component.state.empty = function() {
  return 0;
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
      Meteor.call("upsertSalesForecast", date, parseFloat(newValue), "cafe", function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });

  $(".editableActualSales").editable({
    type: "text",
    title: 'Edit Actual sales',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function(value, response) {
    },
    success: function(response, newValue) {
      var date = $(this).attr("data-date");
      Meteor.call("upsertSalesActual", date, parseFloat(newValue), "cafe", function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });
}