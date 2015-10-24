Template.shiftBasicTimeEditable.onRendered(function () {
  this.$(".time").editable(createShiftStartTimeEditableConfig(this.data));
});

var createShiftStartTimeEditableConfig = function (shift) {
  return {
    type: 'combodate',
    title: 'Select start time',
    template: "HH:mm",
    viewformat: "HH:mm",
    format: "YYYY-MM-DD HH:mm",
    display: false,
    showbuttons: true,
    inputclass: "editableTime",
    mode: 'inline',
    success: function (response, newValue) {
      var shiftId = $(this).closest("li").attr("data-id");
      var obj = {"_id": shiftId};
      var shift = Shifts.findOne(shiftId);
      if (shift) {
        if (origin == "weeklyrostertemplate") {
          obj.startTime = newValue;
        } else if (origin == "weeklyroster") {
          var startHour = moment(newValue).hour();
          var startMin = moment(newValue).minute();
          obj.startTime = moment(shift.shiftDate).set('hour', startHour).set("minute", startMin).toDate();
        }
        editShift(obj);
      }
    }
  };
};

var createShiftEndTimeEditableConfig = function (shift) {
  var onSuccess = function (response, newValue) {
    var shiftId = $(this).closest("li").attr("data-id");
    var obj = {"_id": shiftId};
    var shift = Shifts.findOne(shiftId);
    if (shift) {
      if (origin == "weeklyrostertemplate") {
        obj.endTime = newValue;
      } else if (origin == "weeklyroster") {
        var endHour = moment(newValue).hour();
        var endMin = moment(newValue).minute();
        obj.endTime = moment(shift.shiftDate).set('hour', endHour).set("minute", endMin).toDate();
      }
      editShift(obj);
    }
  };

  return {
    type: 'combodate',
    title: 'Select end time',
    template: "HH:mm",
    viewformat: "HH:mm",
    format: "YYYY-MM-DD HH:mm",
    url: '/post',
    display: false,
    showbuttons: true,
    inputclass: "editableTime",
    mode: 'inline',
    success: onSuccess
  };
};
