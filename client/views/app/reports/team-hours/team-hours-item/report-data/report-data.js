//context: date (Date), userId (User._id)
Template.reportData.helpers({
  startedTimeParams: function () {
    let defaultDate = this.date;
    let shift = this.shift;
    let getShiftProperty = (propertyName, defaultValue) => shift && shift[propertyName] || defaultValue;

    let isMidnight = this.shift && !moment(this.shift.finishedAt).isSame(this.shift.startedAt, 'day');
    return {
      firstTime: getShiftProperty('startedAt', 'Start'),
      secondTime: getShiftProperty('finishedAt', 'End'),
      minuteStepping: 5,
      date: defaultDate,
      ignoreDateRangeCheck: true,
      icon: isMidnight ? 'fa-moon-o midnight-icon' : false,
      onSubmit: function (newStartTime, newEndTime) {
        let newShiftDuration = HospoHero.dateUtils.updateTimeInterval({
          start: getShiftProperty('startedAt', defaultDate),
          end: getShiftProperty('finishedAt', defaultDate)
        }, newStartTime, newEndTime);

        shift.startedAt = newShiftDuration.start;
        shift.finishedAt = newShiftDuration.end;

        Meteor.call('editShift', shift, HospoHero.handleMethodResult());
      }
    };
  },
  isClockedIn: function () {
    return this.shift && this.shift.status === 'started';
  }
});


Template.reportData.events({
  'click .stop-current-shift-button': function (event, tmpl) {
    event.preventDefault();
    var confirmClockOut = confirm('Are you sure you want to clock out this shift?');
    if (confirmClockOut) {
      var id = tmpl.data.shift._id;
      Meteor.call('clockOut', id, HospoHero.handleMethodResult());
    }
  }
});