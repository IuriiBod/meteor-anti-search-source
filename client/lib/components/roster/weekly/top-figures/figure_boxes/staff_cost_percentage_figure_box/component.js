var component = FlowComponents.define("staffCostPercentageFigureBox", function (props) {
    this.actualSales = props.actualSales;
    this.forecastedSales = props.forecastedSales;
    this.actualStaff = props.actualStaff;
    this.forecastedStaff = props.forecastedStaff;
    this.figureBox = new FigureBox();
});

component.state.weeklyStaffWage = function () {
    var actual = ((this.actualStaff/this.actualSales) * 100);
    this.set("actualWage", actual);
    return !isNaN(actual) ? actual.toFixed(2) : 0;
};

component.state.rosteredStaffWage = function () {
    var forecasted = ((this.forecastedStaff/this.forecastedSales) * 100);
    this.set("forecastedWage", forecasted);
    return !isNaN(forecasted) ? forecasted.toFixed(2) : 0;
};

component.state.percent = function () {
    return this.figureBox.percent(this.get("forecastedWage"), this.get("actualWage"));
};