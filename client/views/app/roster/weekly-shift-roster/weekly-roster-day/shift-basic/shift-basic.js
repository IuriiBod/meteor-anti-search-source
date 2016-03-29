Template.shiftBasic.onCreated(function () {
  this.editShiftTime = (newStartTime, newEndTime) => {
    let shift = this.data.shift;

    let dateTimeInterval = HospoHero.dateUtils.updateTimeInterval(
      null, newStartTime, newEndTime, shift.relations.locationId
    );

    shift.startTime = dateTimeInterval.start;
    shift.endTime = dateTimeInterval.end;

    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };
});

Template.shiftBasic.helpers({
  comboDateParams: function () {
    let tmpl = Template.instance();
    return {
      firstTime: tmpl.data.shift.startTime,
      secondTime: tmpl.data.shift.endTime,
      minuteStepping: 15,
      ignoreDateRangeCheck: true,
      onSubmit(startTime, endTime) {
        tmpl.editShiftTime(startTime, endTime);
      }
    };
  },
  isMidnight: function () {
    return !moment(this.startTime).isSame(this.endTime, 'day');
  }
});

Template.shiftBasic.events({
  'click .remove-shift-button': function (event, tmpl) {
    event.preventDefault();
    Meteor.call('deleteShift', tmpl.data.shift._id, HospoHero.handleMethodResult());
  },
  'click .copy-shift-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onCopyShift(tmpl.data.shift);
  }
});