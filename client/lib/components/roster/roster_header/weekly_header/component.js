var component = FlowComponents.define('weeklyHeader', function () {
  var year = Router.current().params.year;
  var week = Router.current().params.week;

  this.set('year', year);
  this.set('week', week);
  this.set('collapseIn', false);
  this.set('publishedOnDate', moment().year(year).week(week).toDate());
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
  Meteor.call('publishRoster', this.get('publishedOnDate'), HospoHero.handleMethodResult());
};