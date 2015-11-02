var component = FlowComponents.define('salesPredictionHeader', function () {
  this.set('currentDate', HospoHero.misc.getWeekDateFromRoute(Router.current()));
});

component.state.onDateChanged = function () {
  return function (weekDate) {
    weekDate.category = Router.current().params.category;
    Router.go('salesPrediction', weekDate);
  };
};
