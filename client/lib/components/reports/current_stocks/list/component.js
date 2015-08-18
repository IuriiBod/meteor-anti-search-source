var component = FlowComponents.define("currentStocksReport", function(props) {});

component.state.week = function() {
  var weekNo = Router.current().params.week;
  var week = getDatesFromWeekNumber(weekNo);
  return week;
}