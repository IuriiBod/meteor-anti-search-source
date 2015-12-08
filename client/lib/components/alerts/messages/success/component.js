var component = FlowComponents.define("alertSuccess", function (props) {
});

component.state.isDailyRoster = function () {
  var route = Router.current().route.getName();
  return route == "dailyRoster";
};

component.state.isTemplateWeeklyRoster = function () {
  var route = Router.current().route.getName();
  return route == "templateWeeklyRoster";
};