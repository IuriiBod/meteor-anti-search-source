//context: date (Date), userId (User._id)

Template.reportData.onCreated(function () {
  this.currentDate = this.data.date;
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
    let changeShiftHours = function (baseDate = newTime, newTime) {
      let newShiftTime = moment(newTime);
      return moment(baseDate)
        .hours(newShiftTime.hours())
        .minutes(newShiftTime.minutes())
        .toDate();
    };

    return {
      firstTime: shift.startedAt || 'Start',
      secondTime: shift.finishedAt || 'End',
      minuteStepping: 5,
      date: Template.instance().currentDate,
      onSubmit: function (newStartTime, newEndTime) {
        shift.startedAt = changeShiftHours(shift.startedAt, newStartTime);
        shift.finishedAt = changeShiftHours(shift.finishedAt, newEndTime);
        Meteor.call('editShift', shift, HospoHero.handleMethodResult());
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
      Meteor.call('clockOut', id, HospoHero.handleMethodResult());
    }
  }
});