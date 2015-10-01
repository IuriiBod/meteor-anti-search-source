var component = FlowComponents.define("currentStocksReport", function(props) {});

component.state.week = function() {
  var weekNo = parseInt(Router.current().params.week);
  var year = parseInt(Router.current().params.year);
  var week = getDatesFromWeekNumber(weekNo, year);
};