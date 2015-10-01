var component = FlowComponents.define("reportData", function(props) {
  this.shift = props;
});

component.state.shift = function() {
  if(this.shift && this.shift.shift && this.shift.shift.shift) {
    var shiftId = this.shift.shift.shift;
    var shift = Shifts.findOne(shiftId);
    return shift && shift.shiftDate <= new Date().getTime() ? shift : null;
  }
};

component.state.currentShift = function() {
  if(this.shift && this.shift.shift && this.shift.shift.shift) {
    var shiftId = this.shift.shift.shift;
    var shift = Shifts.findOne(shiftId);
    var today = moment().format("YYYY-MM-DD");
    return shift && shift.shiftDate == new Date(today).getTime();
  }
};

component.state.nowTime = function() {
  return moment().format("YYYY-MM-DD hh:mm");
};

component.state.startTime = function() {
  var time = moment().hours(8).minutes(0);
  return time.format("YYYY-MM-DD HH:mm");
};

component.state.endTime = function() {
   var time = moment().hours(17).minutes(0);
  return time.format("YYYY-MM-DD HH:mm");
};