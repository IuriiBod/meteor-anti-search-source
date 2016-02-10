//context: weekDate (WeekDate), type ('template'/null)

Template.weeklyShiftRoster.onCreated(function () {
});

Template.weeklyShiftRoster.helpers({
  datesOfWeek: function () {
    var weekDate = this.type !== 'template' ? moment(this.date) : moment(0).week(2).startOf('isoweek');
    return HospoHero.dateUtils.getWeekDays(weekDate);
  }
});