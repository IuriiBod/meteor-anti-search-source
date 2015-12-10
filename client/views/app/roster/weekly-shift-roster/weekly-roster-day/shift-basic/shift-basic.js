Template.shiftBasic.onCreated(function () {
  var self = this;
  self.fixZeroYearComdateMoment = function (timeToFix) {
    var momentToFix = moment(timeToFix);
    var shitTimeMoment = moment().hours(momentToFix.hours());

    shitTimeMoment.minutes(momentToFix.minutes());
    shitTimeMoment.seconds(0);
    return shitTimeMoment.toDate();
  };

  self.editShiftTime = function (newStartTime, newEndTime) {
    var shift = this.data;

    shift.startTime = self.fixZeroYearComdateMoment(newStartTime);
    shift.endTime = self.fixZeroYearComdateMoment(newEndTime);

    HospoHero.dateUtils.adjustShiftTimes(shift);

    Meteor.call('editShift', shift, HospoHero.handleMethodResult(function () {

    }));
  };
});

Template.shiftBasic.helpers({
  comboDateParams: function () {
    var tmpl = Template.instance();
    return {
      firstTime: tmpl.data.startTime,
      secondTime: tmpl.data.endTime,
      minuteStepping: 10,
      onSubmit: function (startTime, endTime) {
        tmpl.editShiftTime(startTime, endTime);
      }
    };
  }
});

Template.shiftBasic.events({
  'click .remove-shift-button': function (event, tmpl) {
    event.preventDefault();
    Meteor.call("deleteShift", tmpl.data._id, HospoHero.handleMethodResult());
  }
});