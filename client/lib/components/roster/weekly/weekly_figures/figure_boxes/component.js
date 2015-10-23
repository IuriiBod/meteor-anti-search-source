var component = FlowComponents.define("figureBoxes", function (props) {
    this.week = Router.current().params.week;
    this.year = Router.current().params.year;
    this.figureBox = new FigureBox();
    this.weekRange = getWeekStartEnd(this.week, this.year);
});

component.state.weeklySale = function () {

    if (this.week < moment().week()) {
        var sales = ImportedActualSales.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch();
        var total = this.figureBox.calcSalesCost(sales);

        //for current week: past days actual sales and for future dates forecasted sales
    } else if (this.week == moment().week()) {
        var todayActualSale = !!ImportedActualSales.findOne({date: TimeRangeQueryBuilder.forDay(moment())});
        if (todayActualSale) {
            var querySeparator = moment().endOf("d");
        } else {
            var querySeparator = moment().startOf("d");
        }
        var actualSales = ImportedActualSales.find({
            date: {
                $gte: this.weekRange.monday,
                $lte: querySeparator.toDate()
            }
        }, {sort: {"date": 1}}).fetch();
        var predictSales = SalesPrediction.find({
            date: {
                $gte: querySeparator.toDate(),
                $lte: this.weekRange.sunday
            }
        }, {sort: {date: 1}}).fetch();
        var total = this.figureBox.calcSalesCost(actualSales) + this.figureBox.calcSalesCost(predictSales);

        //for future weeks: all forecasted sales
    } else if (this.week > moment().week()) {
        sales = SalesPrediction.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch();
        var total = this.figureBox.calcSalesCost(sales);
    }
    return total;
};

component.state.forecastedSale = function () {
    var sales = SalesPrediction.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch();
    var total = this.figureBox.calcSalesCost(sales);
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