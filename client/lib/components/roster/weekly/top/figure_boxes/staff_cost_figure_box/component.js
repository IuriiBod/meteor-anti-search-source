var component = FlowComponents.define("staffCostFigureBox", function (props) {
    this.actual = props.actual;
    this.forecasted = props.forecasted;
    this.onRendered(this.itemRendered);
});

component.state.weeklyStaffCost = function () {
    return this.actual.toFixed(2)
};

component.state.percent = function () {
    var actual = this.actual;
    var forecast = this.forecasted;

    var diff = 0;
    var doc = {
        "value": 0,
        "textColor": "text-navy",
        "icon": "fa-angle-up"
    };

    diff = parseFloat(forecast) - parseFloat(actual);
    doc.value = ((diff / parseFloat(forecast)) * 100).toFixed(2);

    if (diff < 0) {
        doc.textColor = "text-danger";
        doc.icon = "fa-angle-down";
    }
    return doc;
};

component.state.rosteredStaffCost = function () {
    return this.forecasted.toFixed(2)
};

component.prototype.itemRendered = function () {
    this.$('[data-toggle="popover"]').popover({
        content: "The figure shows the actual staff cost result from the days in the past plus " +
                 "the forecast staff cost for the rest of the week. So you can see if you're on track."
    });
};