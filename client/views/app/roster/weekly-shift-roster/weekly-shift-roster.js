//context: weekDate (WeekDate), type ('template'/null)
Template.weeklyShiftRoster.onCreated(function () {
});

Template.weeklyShiftRoster.helpers({
  datesOfWeek: function () {
    var weekDate = this.date ? moment(this.date) : moment();
    return HospoHero.dateUtils.getWeekDays(weekDate);
  }
});





