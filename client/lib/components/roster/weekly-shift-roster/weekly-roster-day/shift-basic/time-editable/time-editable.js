Template.shiftBasicTimeEditable.onRendered(function () {
  this.$('.time').editable(createShiftEndTimeEditableConfig(this));
});


Template.shiftBasicTimeEditable.helpers({
  currentTime: function () {
    return this.shift[this.property];
  }
});


var createShiftEndTimeEditableConfig = function (templateInstance) {
  var onSuccess = function (response, newTime) {
    var shift = templateInstance.data.shift;
    shift[templateInstance.data.property] = newTime;

    HospoHero.dateUtils.adjustShiftTimes(newTime);

    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };

  return {
    type: 'combodate',
    title: 'Select ' + templateInstance.data.caption,
    template: "HH:mm",
    viewformat: "HH:mm",
    format: "YYYY-MM-DD HH:mm",
    display: false,
    showbuttons: true,
    inputclass: "editableTime",
    mode: 'inline',
    success: onSuccess
  };
};

