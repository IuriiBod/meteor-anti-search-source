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