Template.submitShift.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var dateOfShift = $(event.target).find('[name=dateOfShift]').val();
    var startTime = $(event.target).find('[name=startTime]').val();
    var endTime = $(event.target).find('[name=endTime]').val();

    var start_hours = parseInt(startTime.slice(0,1).trim());
    var start_mins = parseInt(startTime.slice(2,4).trim());
    var start_light = startTime.slice(4,8).trim();
    if(start_light == "PM") {
      start_hours += 12;
    }

    var dateObj_start = new Date(dateOfShift);
    dateObj_start.setHours(start_hours, start_mins)
    
    var end_hours = parseInt(endTime.slice(0,1).trim());
    var end_mins = parseInt(endTime.slice(2,4).trim());
    var end_light = endTime.slice(4,8).trim();
    if(end_light == "PM") {
      end_hours += 12;
    }

    var dateObj_end = new Date(dateOfShift);
    dateObj_end.setHours(end_hours, end_mins)

    if(!dateObj_start && !dateObj_end) {
      alert("Please add start time and end time for your shift");
      return;
    } else if(dateObj_start.getTime() == dateObj_end.getTime()) {
      alert("Invalid shift start end time combination");
      return;
    } else if(dateObj_start.getTime() > dateObj_end.getTime()) {
      alert("Invalid shift end time");
      return;
    } else {
      var info = {
        "shiftDate": dateOfShift,
        "startTime": dateObj_start,
        "endTime": dateObj_end
      }
      Meteor.call("createShift", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#submitShiftModal").modal("hide");
        }
      });
    }
  },

  'focus #shiftDate': function(event) {
    $('#shiftDate').datetimepicker({
      pickTime: false,
    });
  },

  'focus .timepicker': function(event) {
    $(".timepicker").datetimepicker({
      pickDate: false,
      pickTime: true,
      useMinutes: true,  
      useCurrent: false
    });
  }
});

Template.submitShift.rendered = function() {
}
