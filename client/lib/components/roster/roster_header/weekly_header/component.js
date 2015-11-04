var component = FlowComponents.define('weeklyHeader', function () {
  var currentDate = HospoHero.misc.getWeekDateFromRoute(Router.current());
  this.set('currentDate', currentDate);
  this.set('collapseIn', false);
  this.set('publishedOnDate', HospoHero.dateUtils.getDateByWeekDate(currentDate));
});

component.state.onDateChanged = function () {
  return function (weekDate) {
    Router.go(Router.current().route.getName(), weekDate);
  };
};

component.state.isPublished = function () {
  var shiftDateQuery = TimeRangeQueryBuilder.forWeek(this.get('publishedOnDate'));
  return !!Shifts.findOne({
    shiftDate: shiftDateQuery,
    published: true,
    'relations.areaId': HospoHero.getCurrentAreaId()
  });
};

component.action.triggerCollapse = function () {
  this.set('collapseIn', !this.get('collapseIn'));
};

component.action.publishRoster = function () {
  var query = TimeRangeQueryBuilder.forWeek(this.get('publishedOnDate'));
  Meteor.call('publishRoster', query, HospoHero.handleMethodResult());
};