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
  return shift.startedAt || 'Start';
};

component.state.endedTime = function () {
  var shift = this.get('shift');
  if (shift.finishedAt) {
    return shift.finishedAt;
  }
  if (shift && moment(shift.shiftDate).isSame(new Date(), 'day')) {
    return 'Now';
  }
  return 'End';
};

component.state.startedTimeParams = function () {
  var self = this;
  var shift = self.get('shift');

  return {
    firstTime: this.get('startedTime'),
    secondTime: this.get('endedTime'),
    minuteStepping: 5,
    onSubmit: function (startTime, endTime) {
      var shift = self.get('shift');
      startTime = moment(startTime);
      endTime = moment(endTime);

      shift.startedAt = moment(shift.startedAt)
        .hours(startTime.hours())
        .minutes(startTime.minutes())
        .toDate();

      shift.finishedAt = moment(shift.finishedAt)
        .hours(endTime.hours())
        .minutes(endTime.minutes())
        .toDate();

      Meteor.call("editShift", shift, HospoHero.handleMethodResult());
    }
  };
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