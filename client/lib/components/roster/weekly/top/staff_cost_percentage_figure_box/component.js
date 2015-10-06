var component = FlowComponents.define("staffCostPercentageFigureBox", function (props) {
    this.week = Router.current().params.week;
    this.year = Router.current().params.year;
    this.weekRange = getWeekStartEnd(this.week, this.year);
    this.onRendered(this.itemRendered);
});
