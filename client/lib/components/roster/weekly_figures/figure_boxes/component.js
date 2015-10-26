var component = FlowComponents.define("figureBoxes", function (props) {
  this.week = Router.current().params.week;
  this.year = Router.current().params.year;
  this.figureBox = new FigureBox();
  this.weekRange = getWeekStartEnd(this.week, this.year);
});

component.state.salesData = function () {
  return{
   weeklySale: weeklySale(this.weekRange, this.figureBox, this.week),
   forecastedSale: forecastedSale(this.weekRange, this.figureBox),
   weeklyStaffCost: weeklyStaffCost(this.weekRange, this.figureBox),
   rosteredStaffCost: rosteredStaffCost(this.weekRange, this.figureBox)
  }
};

weeklySale = function (weekRange, figureBox, week) {
  var total;
  if (week < moment().week()) {
    var sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(weekRange.monday)}, {sort: {"date": 1}}).fetch(); // ImportedActualSales
    total = figureBox.calcSalesCost(sales, 'actualQuantity');

    //for current week: past days actual sales and for future dates forecasted sales
  } else if (week == moment().week()) {
    var todayActualSale = !!DailySales.findOne({date: TimeRangeQueryBuilder.forDay(moment())}); //ImportedActualSales
    var querySeparator = todayActualSale?moment().endOf('d'):moment().startOf('d');
    var actualSales = DailySales.find({ //ImportedActualSales
      date: {
        $gte: weekRange.monday,
        $lte: querySeparator.toDate()
      }
    }, {sort: {"date": 1}}).fetch();
    var predictSales = DailySales.find({ //SalesPrediction
      date: {
        $gte: querySeparator.toDate(),
        $lte: weekRange.sunday
      }
    }, {sort: {date: 1}}).fetch();
    total = figureBox.calcSalesCost(actualSales, 'actualQuantity') + figureBox.calcSalesCost(predictSales, 'predictionQuantity');

    //for future weeks: all forecasted sales
  } else if (week > moment().week()) {
    sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(weekRange.monday)}, {sort: {"date": 1}}).fetch(); //SalesPrediction
    total = figureBox.calcSalesCost(sales, 'predictionQuantity');
  }
  return total;
};

forecastedSale = function (weekRange, figureBox) {
  var sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(weekRange.monday)}, {sort: {"date": 1}}).fetch(); //SalesPrediction
  return figureBox.calcSalesCost(sales, 'predictionQuantity');
};

weeklyStaffCost = function (weekRange, figureBox) {
  var shifts = Shifts.find({shiftDate: TimeRangeQueryBuilder.forWeek(weekRange.monday)}).fetch();
  return figureBox.calcStaffCost(shifts);
};

rosteredStaffCost = function (weekRange, figureBox) {
  var shifts = Shifts.find({shiftDate: TimeRangeQueryBuilder.forWeek(weekRange.monday)}).fetch();
  shifts = _.map(shifts, function (item) {
    item.status = "draft";
    return item;
  });
  return figureBox.calcStaffCost(shifts);
};

