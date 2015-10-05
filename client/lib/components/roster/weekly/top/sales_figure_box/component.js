var component = FlowComponents.define("salesFigureBox", function() {
    this.week = Router.current().params.week;
    this.year = Router.current().params.year;
    this.weekRange = getWeekStartEnd(this.week, this.year);
    this.onRendered(this.itemRendered);
});

component.state.weeklySale = function () {

    if(this.week < moment().week()) {
        var sales = ImportedActualSales.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch();
        var total = calcSalesCost(sales);

        //for current week: past days actual sales and for fututre dates forecasted sales
    } else if(this.week == moment().week()) {
        var todayActualSale = !!ImportedActualSales.findOne({date:TimeRangeQueryBuilder.forDay(moment())});
        if(todayActualSale){
            var querySeparator = moment().endOf("d");
        } else {
            var querySeparator = moment().startOf("d");
        }
        var actualSales = ImportedActualSales.find({date: {$gte: this.weekRange.monday, $lte:querySeparator.toDate()}}, {sort: {"date": 1}}).fetch();
        var predictSales = SalesPrediction.find({date: {$gte:querySeparator.toDate(), $lte: this.weekRange.sunday}}, {sort:{date: 1}}).fetch();
        var total= calcSalesCost(actualSales) + calcSalesCost(predictSales);

        //for future weeks: all forecasted sales
    } else if(this.week > moment().week()) {
        sales = SalesPrediction.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch();
        var total = calcSalesCost(sales);
    }
    this.set("actual", total);
    return parseInt(total).toLocaleString();
};

component.state.forecastedSale = function () {
    var sales = SalesPrediction.find({date: TimeRangeQueryBuilder.forWeek(this.weekRange.monday)}, {sort: {"date": 1}}).fetch();
    var total = calcSalesCost(sales);
    this.set("forecasted", total);
    return total.toFixed(2);
};

component.state.percent = function () {
    var actual = this.get("actual");
    var forecasted = this.get("forecasted");

    var diff = 0;
    var doc = {
        "value": 0,
        "textColor": "text-navy",
        "icon": "fa-angle-up"
    };

    diff = parseFloat(actual) - parseFloat(forecasted);
    doc.value = ((diff/parseFloat(forecasted)) * 100).toFixed(2);
    if(diff < 0) {
        doc.textColor = "text-danger";
        doc.icon = "fa-angle-down";
    }
    return doc;
};

component.prototype.itemRendered = function() {
    $('[data-toggle="popover"]').popover({
        content: "The figure shows the actual sales result from the days in the past plus the forecast sales" +
                 " for the rest of the week. So you can see if you're on track."
    });
};

function calcSalesCost(sales) {
    var totalCost = 0;
    if(sales && sales.length > 0) {
        _.each(sales, function (item) {
            var quantity = item.quantity;
            var price = MenuItems.findOne({_id: item.menuItemId}).salesPrice;
            totalCost += quantity * price;
        });
    }
    return totalCost;
}