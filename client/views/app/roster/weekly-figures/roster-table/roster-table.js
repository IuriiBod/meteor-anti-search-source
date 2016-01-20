Template.rosterTable.helpers({
  weekDate: function () {
    return HospoHero.getParamsFromRoute('date');
  },
  rosterTableDateFormat: function (date) {
    return HospoHero.dateUtils.shortDateFormat(moment(date));
  }
});