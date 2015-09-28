var component = FlowComponents.define("weeklyRosterDay", function(props) {
  this.name = props.name;
  this.origin = props.origin;
});

component.state.name = function() {
  return this.name;
};

component.state.origin = function() {
  return this.origin;
};

component.state.shifts = function() {
  var origin = this.origin;
  if(origin == "weeklyroster") {
    var week = Session.get("thisWeek");
    var date = this.name.date;
    return Shifts.find({
      "shiftDate": new Date(date).getTime(),
      "type": null,
      "relations.areaId": HospoHero.getDefaultArea()
    });
  } else if(origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return Shifts.find({
      "shiftDate": daysOfWeek.indexOf(this.name),
      "type": "template",
      "relations.areaId": HospoHero.getDefaultArea()
    });
  }
};

component.action.addShift = function(day, dates) {
  var doc = {
    "assignedTo": null,
    "week": dates
  };
  if(this.origin == "weeklyroster") {
    doc.startTime = new Date(day).setHours(8, 0);
    doc.endTime = new Date(day).setHours(17, 0);
    doc.shiftDate = moment(new Date(day)).format("YYYY-MM-DD");
    doc.section = null;
    doc.type = null;
  } else if(this.origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    doc.startTime = new Date().setHours(8, 0);
    doc.endTime = new Date().setHours(17, 0);
    doc.shiftDate = new Date(daysOfWeek.indexOf(day));
    doc.section = null;
    doc.type = "template";
  }
  Meteor.call("createShift", doc, function(err, id) {
    if(err) {
      HospoHero.alert(err);
    }
  });
};

component.state.isTemplate = function() {
  return this.origin == "weeklyrostertemplate";
};