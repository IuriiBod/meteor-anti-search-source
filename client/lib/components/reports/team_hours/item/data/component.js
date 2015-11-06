var component = FlowComponents.define("reportData", function (props) {
  //may be undefined
  var currentShift = Shifts.findOne({
    "assignedTo": props.userId,
    "shiftDate": TimeRangeQueryBuilder.forDay(props.date)
  });
  
  //exclude this shift if it is in future
  var endOfToday = moment().endOf('day');
  if (currentShift && moment(currentShift.shiftDate).isAfter(endOfToday)) {
    currentShift = false;
  }

  this.set('shift', currentShift);
});

component.state.isCurrentShift = function () {
  var shift = this.get('shift');
  return shift && moment(shift.shiftDate).isSame(new Date(), 'day');
};

component.state.nowTime = function () {
  return moment().format("YYYY-MM-DD hh:mm");
};

//todo: probably we should use organization's start and end work time here
component.state.startTime = function () {
  var time = moment().hours(8).minutes(0);
  return time.format("YYYY-MM-DD HH:mm");
};

component.state.endTime = function () {
  var time = moment().hours(17).minutes(0);
  return time.format("YYYY-MM-DD HH:mm");
};