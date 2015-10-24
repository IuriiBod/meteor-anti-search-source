console.log('test');

Template.shiftBasicTimeEditable.onRendered(function () {
  //var editableSelector = '.' + this.data.property + '-picker';
  this.$('.time').editable(createShiftEndTimeEditableConfig(this));
});

var createShiftEndTimeEditableConfig = function (templateInstance) {
  var onSuccess = function (response, newTime) {
    console.log('success', newTime);

    var shift = templateInstance.data.shift;

    shift[templateInstance.data.property] = HospoHero.dateUtils.shiftDate(newTime, shift.type === 'template');
    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };

  var shift = templateInstance.data.shift;
  return {
    type: 'combodate',
    title: 'Select ' + templateInstance.data.caption,
    template: 'HH:mm',
    viewformat: 'HH:mm',
    showbuttons: true,
    inputclass: 'editableTime',
    mode: 'inline',
    value: moment(shift[templateInstance.data.property]),
    success: onSuccess
  };
};
