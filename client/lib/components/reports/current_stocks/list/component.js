var component = FlowComponents.define("currentStocksReport", function(props) {});

component.state.week = function() {
  var weekNo = Router.current().params.week;
  var year = Router.current().params.year;
  var currentDate = new Date(year);
  var week = getDatesFromWeekNumberWithYear(parseInt(weekNo), currentDate);
  return week;
}
