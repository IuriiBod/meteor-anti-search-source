var component = FlowComponents.define("weeklyFigures", function (props) {
  this.weekDate = props.weekDate;
});

component.state.weekDates = function () {
  return HospoHero.dateUtils.getWeekDays(this.weekDate);
};
