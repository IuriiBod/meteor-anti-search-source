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
    this.set("forecastSales", salesForecast.forecastedRevenue);
    return salesForecast;
  }
}

component.state.sales = function() {
  var sales = ActualSales.findOne({"date": new Date(this.dayObj.date).getTime(), "department": "cafe"});
  if(sales) {
    this.set("actualSales", sales.revenue);
    return sales;
  }
}

component.state.class = function() {
  var actual = this.get("actualSales");
  var forecast = this.get("forecastSales");
  if(actual && forecast) {
    if(actual >= forecast) {
      return "text-info";
    } else {
      return "text-danger";
    }
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
          HospoHero.alert(err);
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
          HospoHero.alert(err);
        }
      });
    }
  });
}