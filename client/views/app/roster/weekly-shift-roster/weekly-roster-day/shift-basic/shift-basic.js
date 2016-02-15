Template.shiftBasic.onCreated(function () {
  var self = this;

  self.editShiftTime = function (newStartTime, newEndTime) {
    let shift = this.data;

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
      firstTime: tmpl.data.startTime,
      secondTime: tmpl.data.endTime,
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
    Meteor.call('deleteShift', tmpl.data._id, HospoHero.handleMethodResult());
  },
  'click .copy-shift-button': function (event) {
    event.preventDefault();

    Session.set('copiedShift', this);
  }
});