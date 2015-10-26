var component = FlowComponents.define("figureBoxes", function (props) {
  var data = {
    week: Router.current().params.week,
    year: Router.current().params.year
  };
  this.figureBox = new FigureBox(data);
});

component.state.salesData = function () {
  return{
   weeklySale: this.figureBox.getWeeklySale(),
   forecastedSale: this.figureBox.getForecastedSales(),
   weeklyStaffCost: this.figureBox.getWeeklyStaffCost(),
   rosteredStaffCost: this.figureBox.getRosteredStaffCost()
  }
};