var component = FlowComponents.define('salesPredictionHeader', function (props) {
});

component.state.currentDate = function () {
  return Router.current().params.date;
};
