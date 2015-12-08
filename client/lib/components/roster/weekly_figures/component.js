var component = FlowComponents.define("weeklyFigures", function (props) {
  this.weekDate = props.weekDate;
  this.figureBoxDataHelper = new FigureBoxDataHelper(weekDate);
});

component.state.weekDates = function () {
  return HospoHero.dateUtils.getWeekDays(this.weekDate);
};

component.state.figureBoxDataHelper = function () {
  return this.figureBoxDataHelper;
};