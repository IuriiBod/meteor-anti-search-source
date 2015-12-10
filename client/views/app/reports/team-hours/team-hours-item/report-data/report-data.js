//context: date (Date), userId (User._id)

Template.reportData.onCreated(function () {
  this.getCurrentShift = function () {
    return Shifts.findOne({
      assignedTo: this.data.userId,
      startTime: TimeRangeQueryBuilder.forDay(this.data.date)
    });
  };
});


Template.reportData.helpers({
  shift: function () {
    return Template.instance().getCurrentShift();
  },

  startedTimeParams: function (shift) {
    var restoreShiftDate = function (baseDate, newTime) {
      var newMoment = moment(newTime);
      return moment(baseDate)
        .hours(newMoment.hours())
        .minutes(newMoment.minutes())
        .toDate();
    };

    return {
      firstTime: shift.startedAt,
      secondTime: shift.finishedAt,
      minuteStepping: 5,
      onSubmit: function (startTime, endTime) {
        shift.startedAt = restoreShiftDate(shift.startedAt, startTime);
        shift.finishedAt = restoreShiftDate(shift.finishedAt, endTime);
        Meteor.call("editShift", shift, HospoHero.handleMethodResult());
      }
    };
  }
});


Template.reportData.events({
  'click .stopCurrentShift': function (event, tmpl) {
    event.preventDefault();
    var confirmClockOut = confirm('Are you sure you want to clock out this shift?');
    if (confirmClockOut) {
      var id = tmpl.getCurrentShift()._id;
      Meteor.call("clockOut", id, HospoHero.handleMethodResult());
    }
  }
});