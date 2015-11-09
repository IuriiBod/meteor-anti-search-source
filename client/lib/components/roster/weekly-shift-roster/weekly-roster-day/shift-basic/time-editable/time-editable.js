Template.shiftBasicTimeEditable.onRendered(function () {
  this.$('.time').editable(createShiftEndTimeEditableConfig(this));
});


Template.shiftBasicTimeEditable.helpers({
  currentTime: function () {
    var currentTime = this.shift[this.property];
    return HospoHero.dateUtils.getTimeWithTimezone(null, currentTime);
  }
});


var createShiftEndTimeEditableConfig = function (templateInstance) {
  var fixZeroYearComdateMoment = function (momentToFix) {
    var shitTimeMoment = moment().hours(momentToFix.hours());
    shitTimeMoment.minutes(momentToFix.minutes());
    shitTimeMoment.seconds(0);
    return shitTimeMoment.toDate();
  };

  var onSuccess = function (response, newTime) {
    var shift = templateInstance.data.shift;

    shift[templateInstance.data.property] = fixZeroYearComdateMoment(newTime);

    HospoHero.dateUtils.adjustShiftTimes(shift);

    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };

  return {
    type: 'combodate',
    title: 'Select ' + templateInstance.data.caption,
    template: "h:mm A",
    viewformat: "h:mm A",
    format: "YYYY-MM-DD h:mm A",
    display: false,
    showbuttons: true,
    inputclass: "editableTime",
    mode: 'inline',
    success: onSuccess
  };
};

