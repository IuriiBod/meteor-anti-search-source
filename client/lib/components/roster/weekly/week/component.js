var component = FlowComponents.define("weeklyShiftRoster", function(props) {
  this.name = props.name;
});

component.state.week = function() {
  if(this.name == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var year = Router.current().params.year;
    var currentDate = new Date(year);
    return getDatesFromWeekNumberWithYear(parseInt(weekNo), currentDate);
  } else if(this.name == "weeklyrostertemplate") {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  }
};

component.state.origin = function() {
  return this.name;
};