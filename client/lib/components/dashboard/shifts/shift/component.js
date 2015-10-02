var component = FlowComponents.define("shiftItem", function(props) {
  this.shift = props.shift;
  this.shiftState = props.shiftState;
});

component.state.shift = function() {
  return this.shift ? this.shift : false;
};

component.state.section = function() {
  if(this.shift) {
    if(this.shift.section) {
      var section = Sections.findOne(this.shift.section);
      if(section) {
        return section.name;
      } 
    } else {
      return "Open";
    }
  }
};

component.state.hasClaimed = function() {
  var shift = this.shift;
  if(shift && shift.claimedBy) {
    return shift.claimedBy.indexOf(Meteor.userId()) >= 0;
  }
};

component.state.hadBeenRejected = function() {
  var shift = this.shift;
  if(shift && shift.rejectedFor) {
    return shift.rejectedFor.indexOf(Meteor.userId()) >= 0;
  }
};

component.state.confirmed = function() {
  if(this.shift && this.shift.confirmed) {
    return "success";
  }
};

component.state.isPermitted = function() {
  if(this.shift && this.shift.shiftDate) {
    return this.shift.shiftDate >= new Date().getTime();
  }
};

component.state.timeRecorded = function() {
  if(this.shift && this.shift.shiftDate) {
    if(this.shift.shiftDate < new Date().getTime()) {
     if(this.shift.startedAt && this.shift.finishedAt) {
        return this.shift.finishedAt - this.shift.startedAt; 
      }
    }
  }
};

component.state.activeShift = function() {
  return !!(this.shift && this.shift.status == 'started');
};

component.state.open = function() {
  return this.shiftState == 'open';
};

component.state.past = function() {
  return this.shiftState == 'past';
};