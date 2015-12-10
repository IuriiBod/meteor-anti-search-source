var component = FlowComponents.define('addNewUnavailability', function () {
  this.set('timePickerVisibility', '');
  this.set('isAllDay', false);
});

component.action.isAllDayChange = function (value) {
  this.set('isAllDay', value);
  if (value) {
    this.set('timePickerVisibility', 'hide');
  } else {
    this.set('timePickerVisibility', '');
  }
};

component.action.addUnavailability = function (params, flyout) {
  var startDate = this.getDateFromDateAndTimePickers(params.date, params.startTime);
  var endDate = this.getDateFromDateAndTimePickers(params.date, params.endTime);

  if (this.get('isAllDay')) {
    startDate = moment(startDate).startOf('day').toDate();
    endDate = moment(endDate).endOf('day').toDate();
  }

  var unavailability = {
    startDate: startDate,
    endDate: endDate,
    isAllDay: this.get('isAllDay'),
    repeat: params.repeat,
    comment: params.comment
  };

  // close flyout, if success
  Meteor.call('addUnavailability', unavailability, HospoHero.handleMethodResult(function () {
    flyout.close();
  }));
};

component.prototype.getDateFromDateAndTimePickers = function (date, time) {
  return moment(date).hours(time.hours()).minutes(time.minutes()).toDate();
};