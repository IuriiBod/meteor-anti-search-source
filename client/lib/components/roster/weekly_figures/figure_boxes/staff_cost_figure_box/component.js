var component = FlowComponents.define("staffCostFigureBox", function (props) {
    this.actual = props.actual;
    this.forecasted = props.forecasted;
    this.figureBox = new FigureBox();
});

component.state.weeklyStaffCost = function () {
    return this.actual.toFixed(2)
};

component.state.percent = function () {
    return this.figureBox.percent(this.forecasted,this.actual);
};

component.state.rosteredStaffCost = function () {
    return this.forecasted.toFixed(2)
};