var component = FlowComponents.define("figureBoxes", function (props) {
  this.week = Router.current().params.week;
  this.year = Router.current().params.year;
  this.figureBox = new FigureBox();
  this.weekRange = getWeekStartEnd(this.week, this.year);
});

component.state.weeklySale = function () {

  if (this.week < moment().week()) {
    var sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch(); // ImportedActualSales
    var total = this.figureBox.calcSalesCost(sales, 'actualQuantity');

    //for current week: past days actual sales and for future dates forecasted sales
  } else if (this.week == moment().week()) {
    var todayActualSale = !!DailySales.findOne({date: TimeRangeQueryBuilder.forDay(moment())}); //ImportedActualSales
    if (todayActualSale) {
      var querySeparator = moment().endOf('d');
    } else {
      var querySeparator = moment().startOf('d');
    }
    var actualSales = DailySales.find({ //ImportedActualSales
      date: {
        $gte: this.weekRange.monday,
        $lte: querySeparator.toDate()
      }
    }, {sort: {"date": 1}}).fetch();
    var predictSales = DailySales.find({ //SalesPrediction
      date: {
        $gte: querySeparator.toDate(),
        $lte: this.weekRange.sunday
      }
    }, {sort: {date: 1}}).fetch();
    var total = this.figureBox.calcSalesCost(actualSales, 'actualQuantity') + this.figureBox.calcSalesCost(predictSales, 'predictionQuantity');

    //for future weeks: all forecasted sales
  } else if (this.week > moment().week()) {
    sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch(); //SalesPrediction
    var total = this.figureBox.calcSalesCost(sales, 'predictionQuantity');
  }
  return total;
};

component.state.forecastedSale = function () {
  var sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch(); //SalesPrediction
  var total = this.figureBox.calcSalesCost(sales, 'predictionQuantity');
  return total;
};


component.state.weeklyStaffCost = function () {
  var shifts = Shifts.find({shiftDate: TimeRangeQueryBuilder.forWeek(this.weekRange.monday, true)}).fetch();
  var total = this.figureBox.calcStaffCost(shifts);
  return total
};

component.state.rosteredStaffCost = function () {
  var shifts = Shifts.find({shiftDate: TimeRangeQueryBuilder.forWeek(this.weekRange.monday, true)}).fetch();
  shifts = _.map(shifts, function (item) {
    item.status = "draft";
    return item;
  });
  var total = this.figureBox.calcStaffCost(shifts);
  return total
};