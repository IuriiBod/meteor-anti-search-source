var component = FlowComponents.define("staffCostPercentagesTr", function(props) {
  this.dayObj = props.day;
  this.figureBox = new FigureBox();
});

component.state.actual = function() {
  var self = this;
  var wages = 0;
  var sales = 0;

  var shifts = Shifts.find({"shiftDate": HospoHero.dateUtils.shiftDate(self.dayObj.date), "status": {$ne: "draft"}, "type": null}).fetch();
  wages = this.figureBox.calcStaffCost(shifts);
  
  var actualSales = ImportedActualSales.find({"date": TimeRangeQueryBuilder.forDay(this.dayObj.date)}).fetch();
  sales = this.figureBox.calcSalesCost(actualSales);

  var percentage = 0;
  if(sales > 0) {
    percentage = (wages/sales);
  }
  percentage = percentage * 100;
  this.set("actualStaffCostPercentage", percentage);
  return percentage;
};

component.state.forecast = function() {
  var self = this;
  var wages = 0;
  var sales = 0;

  var shifts = Shifts.find({"shiftDate": HospoHero.dateUtils.shiftDate(self.dayObj.date), "status": {$ne: "finished"}, "type": null}).fetch();
  wages = this.figureBox.calcStaffCost(shifts);
  
  var forecastesSales = SalesPrediction.find({"date": TimeRangeQueryBuilder.forDay(this.dayObj.date)}).fetch();
  sales = this.figureBox.calcSalesCost(forecastesSales);

  var percentage = 0;
  if(sales > 0) {
    percentage = (wages/sales);
  }
  percentage = percentage * 100;
  this.set("forecastedStaffCostPercentage", percentage);
  return percentage;
};

component.state.class = function() {
  var actual = this.get("actualStaffCostPercentage");
  var forecast = this.get("forecastedStaffCostPercentage");
  if(actual && forecast) {
    if(actual <= forecast) {
      return "text-info";
    } else {
      return "text-danger";
    }
  }
};