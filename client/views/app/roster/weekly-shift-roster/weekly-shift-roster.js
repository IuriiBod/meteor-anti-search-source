//context: weekDate (WeekDate), type ('template'/null)
Template.weeklyShiftRoster.onCreated(function () {
});

Template.weeklyShiftRoster.helpers({
  datesOfWeek: function () {
    var weekDate;

    if (this.weekDate) {
      weekDate = this.weekDate;
    } else {
      var currentMoment = moment();
      weekDate = {
        week: currentMoment.week(),
        year: currentMoment.year()
      }
    }

    return HospoHero.dateUtils.getWeekDays(weekDate);
  }
});





