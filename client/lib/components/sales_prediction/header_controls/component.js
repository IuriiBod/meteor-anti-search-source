var component = FlowComponents.define('salesPredictionHeader', function (props) {
});

component.state.year = function () {
  return Router.current().params.year;
};

component.state.week = function () {
  return Router.current().params.week;
};

component.state.onDateChanged = function () {
  return function (weekDate) {
    weekDate.category = Router.current().params.category;
    Router.go('salesPrediction', weekDate);
  };
};
