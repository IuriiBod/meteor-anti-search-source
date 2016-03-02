Template.locationTimeSelect.onCreated(function () {
  this.set('label', this.data.label);
  this.set('currentTimeMoment', moment(this.data.time));

  this.set('hoursName', this.data.hoursName);
  this.set('minutesName', this.data.minutesName);
});

Template.locationTimeSelect.helpers({
  selectedMinutes: function () {
    var time = Template.instance().get('currentTimeMoment');
    return time.minutes();
  },
  selectedHours: function () {
    var time = Template.instance().get('currentTimeMoment');
    return time.hours();
  }
});