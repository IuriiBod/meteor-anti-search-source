var component = FlowComponents.define('reportsHeader', function () {
  this.set('currentDate', HospoHero.misc.getWeekDateFromRoute(Router.current()));
});

component.state.onDateChanged = function () {
  return function (weekDate) {
    var routeName = Router.current().route.getName();
    Router.go(routeName, weekDate);
  };
};