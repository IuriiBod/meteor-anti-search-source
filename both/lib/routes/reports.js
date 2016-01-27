Router.route('/reports/:date', {
  name: "teamHours",
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
    return {
      date: HospoHero.getParamsFromRoute('date', this)
    }
  }
});

Router.route('/stock-report', {
  name: "stockReport",
  template: "stockReport",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('stocktakeList', currentAreaId)
    ];
  },
  data: function () {
    return {
      date: HospoHero.dateUtils.getDateStringForRoute()
    }
  }
});