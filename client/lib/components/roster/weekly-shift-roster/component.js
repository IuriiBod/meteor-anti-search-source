var component = FlowComponents.define("weeklyShiftRoster", function (props) {
  this.set('type', props.type);

  if (props.weekDate) {
    this.weekDate = props.weekDate;
  } else {
    var currentMoment = moment();
    this.weekDate = {
      week: currentMoment.week(),
      year: currentMoment.year()
    }
  }
});

component.state.datesOfWeek = function () {
  return HospoHero.dateUtils.getWeekDays(this.weekDate);
};


