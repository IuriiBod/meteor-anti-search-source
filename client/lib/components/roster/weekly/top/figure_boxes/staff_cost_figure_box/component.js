var component = FlowComponents.define("staffCostFigureBox", function (props) {
    this.actual = props.actual;
    this.forecasted = props.forecasted;
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