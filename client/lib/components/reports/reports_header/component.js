var component = FlowComponents.define('reportsHeader', function () {
  this.set('currentDate', HospoHero.misc.getWeekDateFromRoute(Router.current()));
});

component.state.onDateChanged = function () {
  return function (weekDate) {
    Router.go(Router.current().route.getName(), weekDate);
  };
};