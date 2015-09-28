Template.submitShift.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var dateOfShift = $(event.target).find('[name=dateOfShift]').val();
    var startTime = $(event.target).find('[name=startTime]').val().trim();
    var endTime = $(event.target).find('[name=endTime]').val().trim();
    var section = $(event.target).find('[name=section]').val();

    var start_hours = parseInt(startTime.slice(0, startTime.indexOf(":")).trim());
    var start_mins = parseInt(startTime.slice(startTime.indexOf(":") + 1, startTime.indexOf(" ")).trim());
    var start_light = startTime.slice(startTime.indexOf(" "), 8).trim();
    if(start_light == "PM") {
      start_hours += 12;
    }

    var dateObj_start = new Date(dateOfShift);
    dateObj_start.setHours(start_hours, start_mins)
      
    var end_hours = parseInt(endTime.slice(0, endTime.indexOf(":")).trim());
    var end_mins = parseInt(endTime.slice(endTime.indexOf(":") + 1, endTime.indexOf(" ")).trim());
    var end_light = endTime.slice(endTime.indexOf(" "), 8).trim();
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
        "endTime": dateObj_end,
        "section": section
      }
      var weekNo = moment(dateOfShift).week();
      var week = getDatesFromWeekNumber(parseInt(weekNo));
      var dates = [];
      week.forEach(function(day) {
        if(day && day.date) {
          dates.push(new Date(day.date).getTime())
        }
      });
      if(dates.length > 0) {
        info.week = dates;
      }
      Meteor.call("createShift", info, function(err, id) {
        if(err) {
          HospoHero.alert(err);
        } else {
          $("#submitShiftModal").modal("hide");
          var recurringJobs = Jobs.find({
            "type": "Recurring", 
            "createdOn": new Date(dateOfShift).toDateString(), 
            "section": section,
            "status": "draft"}).fetch();
          if(recurringJobs.length > 0) {
            recurringJobs.forEach(function(job) {
              Meteor.call("assignJob", job._id, id, job.startAt, function(err) {
                if(err) {
                  HospoHero.alert(err);
                } 
              });
            });
          }
          $('#calendar').fullCalendar('rerenderEvents')
          Blaze.render(Template.dailyShiftScheduling, document.getElementById("dailyShiftSchedulingMainView"))
        }
      });
    }
  },

  'focus #shiftDate': function(event) {
    event.preventDefault();
    $('#shiftDate').datetimepicker({
      format: "YYYY-MM-DD"
    });
  },

  'focus .timepicker': function(event) {
    event.preventDefault();
    $(".timepicker").datetimepicker({
      format: "LT",
    });
  }
});
