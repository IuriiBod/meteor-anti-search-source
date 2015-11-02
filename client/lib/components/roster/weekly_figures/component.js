var component = FlowComponents.define("weeklyFigures", function (props) {
  this.weekDate = props.weekDate;
  var weekDate = {
    week: Router.current().params.week,
    year: Router.current().params.year
  };
  this.figureBoxDataHelper = new FigureBoxDataHelper(weekDate);
});

component.state.weekDates = function () {
  return HospoHero.dateUtils.getWeekDays(this.weekDate);
};

component.state.figureBoxDataHelper = function () {
  return this.figureBoxDataHelper;
};