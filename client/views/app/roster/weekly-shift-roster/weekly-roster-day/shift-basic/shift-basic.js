Template.shiftBasic.onCreated(function () {
  var self = this;

  self.editShiftTime = function (newStartTime, newEndTime) {
    let shift = this.data.shift;

    let newShiftDuration = HospoHero.dateUtils.updateTimeInterval({
      start: shift.startTime,
      end: shift.endTime
    }, newStartTime, newEndTime);

    shift.startTime = newShiftDuration.start;
    shift.endTime = newShiftDuration.end;

    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };
});

Template.shiftBasic.helpers({
  comboDateParams: function () {
    var tmpl = Template.instance();
    return {
      firstTime: tmpl.data.shift.startTime,
      secondTime: tmpl.data.shift.endTime,
      minuteStepping: 15,
      ignoreDateRangeCheck: true,
      onSubmit: function (startTime, endTime) {
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