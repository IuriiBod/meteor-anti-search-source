Router.route('/reports/:year/:week', {
  name: "teamHours",
  path: "/reports/:year/:week",
  template: "teamHoursMainView",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('weeklyRoster', weekRange, currentAreaId)
    ];
  },
  data: function () {
    Session.set("editStockTake", false);
  }
});