Template.rosterTable.helpers({
  weekDates: function () {
    return HospoHero.dateUtils.getWeekDays(this.date);
  },
  rosterTableDateFormat: function () {
    return HospoHero.dateUtils.shortDateFormat(this);
  }
});