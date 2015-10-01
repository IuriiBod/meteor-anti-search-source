Template.reportData.events({
  "mouseenter .editShiftStart": function(event) {
    event.preventDefault();
    $('.editShiftStart').editable({
      type: 'combodate',
      title: 'Select time',
      template: "HH:mm",
      viewformat: "HH:mm",
      format: "YYYY-MM-DD HH:mm",
      display: true,
      autotext: 'auto',
      showbuttons: true,
      mode: 'inline',
      success: function(response, newValue) {
        var self = this;
        var id = $(self).data("shift");
        var time = $(self).data("time");
        var newTime = shiftWorkTimeUpdate(id, newValue);
        newTime = moment(newTime).format("YYYY-MM-DD HH:mm");
        Meteor.call("editClock", id, {"startedAt": new Date(newTime).getTime()}, function(err) { 
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            $(self).removeClass('editable-unsaved');
          }
        });
      }
    });

    $('.editShiftEnd').editable({
      type: 'combodate',
      title: 'Select time',
      template: "HH:mm",
      viewformat: "HH:mm",
      format: "YYYY-MM-DD HH:mm",
      display: false,
      autotext: 'auto',
      showbuttons: true,
      combodate: {
        minuteStep: 5
      },
      mode: 'inline',
      success: function(response, newValue) {
        var self = this;
        var id = $(self).data("shift");
        var time = $(self).data("time");
        var newTime = shiftWorkTimeUpdate(id, newValue);
        newTime = moment(newTime).format("YYYY-MM-DD HH:mm");
        Meteor.call("editClock", id, {"finishedAt": new Date(newTime).getTime()}, function(err) { 
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            $(self).removeClass('editable-unsaved');
          }
        });
      }
    });
  }
});

function shiftWorkTimeUpdate(id, newValue) {
  var shift = Shifts.findOne(id);
  if(shift && newValue) {
    var time = shift.shiftDate;
    var newHours = moment(newValue).format("HH");
    var newMins = moment(newValue).format("mm");
    if(newMins <= 0) {
      newMins = 0;
    }
    return moment(time).set("hour", newHours).set("minute", newMins);
  }
}