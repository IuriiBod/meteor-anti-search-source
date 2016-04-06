//context: date (Date), userId (User._id)
Template.teamHoursDayEntity.helpers({
  startedTimeParams: function () {
    let defaultDate = this.date;
    let shift = this.shift;

    let getShiftDate = (propertyName, defaultValue) => {
      let locationDate = () => HospoHero.dateUtils.formatTimeToLocationTimezone(shift[propertyName], shift.relations.locationId);
      return shift && shift[propertyName] ? locationDate() : defaultValue;
    };

    return {
      firstTime: getShiftDate('startedAt', 'Start'),
      secondTime: getShiftDate('finishedAt', 'End'),
      minuteStepping: 5,
      date: defaultDate,
      ignoreDateRangeCheck: true,
      icon: isMidnight(shift) ? 'fa-moon-o midnight-icon' : false,
      onSubmit(newStartTime, newEndTime) {
        let newShiftDuration = HospoHero.dateUtils.updateTimeInterval(
          getShiftDate('startedAt', defaultDate), newStartTime, newEndTime, shift.relations.locationId
        );

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


Template.teamHoursDayEntity.events({
  'click .stop-current-shift-button': function (event, tmpl) {
    event.preventDefault();
    var confirmClockOut = confirm('Are you sure you want to clock out this shift?');
    if (confirmClockOut) {
      var id = tmpl.data.shift._id;
      Meteor.call('clockOut', id, HospoHero.handleMethodResult());
    }
  }
});

const isMidnight = (shift) => {
  let localFinishedAtMoment = shift && shift.finishedAt && HospoHero.dateUtils.getDateMomentForLocation(shift.finishedAt);
  return localFinishedAtMoment && !localFinishedAtMoment.isSame(shift.startedAt, 'day');
};