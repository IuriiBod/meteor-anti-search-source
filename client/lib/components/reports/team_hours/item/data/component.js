var component = FlowComponents.define("reportData", function (props) {
  this.userId = props.userId;
  this.shiftDate = TimeRangeQueryBuilder.forDay(props.date);

  this.set('editStart', false);
  this.set('editEnd', false);
});

component.state.shift = function () {
  return Shifts.findOne({
    "assignedTo": this.userId,
    "shiftDate": this.shiftDate
  });
};

component.state.startedTime = function () {
  var shift = this.get('shift');
  if (shift.startedAt) {
    return moment(shift.startedAt).format("hh:mm A");
  }
  return 'Start';
};

component.state.endedTime = function () {
  var shift = this.get('shift');
  if (shift.finishedAt) {
    return moment(shift.finishedAt).format("hh:mm A");
  }
  if (shift && moment(shift.shiftDate).isSame(new Date(), 'day')) {
    return 'Now';
  }
  return 'End';
};

component.action.toggleEditStartTime = function () {
  this.set('editStart', true);
};

component.action.toggleEditEndTime = function () {
  this.set('editEnd', true);
};

component.action.clockOut = function () {
  var id = this.get('shift')._id;
  Meteor.call("clockOut", id, HospoHero.handleMethodResult());
};

component.state.toggleEditStartTime = function () {
  var self = this;
  return function () {
    self.set('editStart', false);
  }
};

component.state.toggleEditEndTime = function () {
  var self = this;
  return function () {
    self.set('editEnd', false);
  }
};

//todo: probably we should use organization's start and end work time here
// not using at the moment
//
//component.state.startTime = function () {
//  var time = moment().hours(8).minutes(0);
//  return time.format("YYYY-MM-DD HH:mm");
//};
//
//component.state.endTime = function () {
//  var time = moment().hours(17).minutes(0);
//  return time.format("YYYY-MM-DD HH:mm");
//};