var component = FlowComponents.define("schedulingShift", function(props) {
  this.shift = props.shift;
});

component.state.name = function() {
  var name = null;
  if(this.shift) {
    var startTime = moment(this.shift.startTime).format("hh:mm A");
    var endTime = moment(this.shift.endTime).format("hh:mm A");
    name = startTime + " - " + endTime + " Shift";
  }
  return name;
};

component.state.assignedWorker = function() {
  if(this.shift) {
    var user = Meteor.users.findOne(this.shift.assignedTo);
    if(user) {
      return user.username;
    }
  }
};

component.state.id = function() {
  if(this.shift) {
    return this.shift._id;
  }
};

component.state.jobs = function() {
  if(this.shift) {
    return this.shift.jobs.length > 0;
  }
};

component.state.jobsList = function() {
  if(this.shift) {
    return Jobs.find({"_id": {$in: this.shift.jobs}}).fetch();
  }
};

component.state.workers = function() {
  return Meteor.users.find({"_id": {$nin: this.shift.assignedTo}});
};

component.state.timeLine = function() {
  var line = [];
  for(var i=1; i<=24; i++) {
    line.push(i + ":00");
  }
  return line;
};