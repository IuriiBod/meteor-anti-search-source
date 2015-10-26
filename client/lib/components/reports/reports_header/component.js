var component = FlowComponents.define('reportsHeader', function (props) {
  this.set('year', Router.current().params.year);
  this.set('week', Router.current().params.week);

  // TODO: Do we need this state?
  this.set('type', 'reports');
});

component.state.onDateChanged = function () {
  return function (weekDate) {
    Router.go(Router.current().route.getName(), weekDate);
  };
};