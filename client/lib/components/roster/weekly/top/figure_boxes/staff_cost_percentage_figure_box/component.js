var component = FlowComponents.define("staffCostPercentageFigureBox", function (props) {
    this.actualSales = props.actualSales;
    this.forecastedSales = props.forecastedSales;
    this.actualStaff = props.actualStaff;
    this.forecastedStaff = props.forecastedStaff;

    this.onRendered(this.itemRendered);
});

component.state.weeklyStaffWage = function () {
    var actual = ((this.actualStaff/this.actualSales) * 100);
    this.set("actualWage", actual);
    return actual.toFixed(2);
};

component.state.rosteredStaffWage = function () {
    var forecasted = ((this.forecastedStaff/this.forecastedSales) * 100);
    this.set("forecastedWage", forecasted);
    return forecasted.toFixed(2);
};

component.state.percent = function () {
    var actual = this.get("actualWage");
    var forecasted = this.get("forecastedWage");
    var diff = 0;
    var doc = {
        "value": 0,
        "textColor": "text-navy",
        "icon": "fa-angle-up"
    };

    diff = parseFloat(forecasted) - parseFloat(actual);
    doc.value = ((diff / parseFloat(forecasted)) * 100).toFixed(2);
    if (diff < 0) {
        doc.textColor = "text-danger";
        doc.icon = "fa-angle-down";
    }
    return doc;
};

component.prototype.itemRendered = function () {
    this.$('[data-toggle="popover"]').popover({
        content: "The figure shows the % of wages compared to sales. It take the actual results " +
                 "from past days and forecasts from future days."
    });
};