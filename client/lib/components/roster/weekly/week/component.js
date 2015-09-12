var component = FlowComponents.define("weeklyShiftRoster", function(props) {
  this.name = props.name;
});

component.state.week = function() {
  if(this.name == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var year = Router.current().params.year;
    var currentDate = new Date(year);
    var week = getDatesFromWeekNumberWithYear(parseInt(weekNo), currentDate);
    return week;
  } else if(this.name == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek;
  }
}

component.state.origin = function() {
  return this.name;
}
