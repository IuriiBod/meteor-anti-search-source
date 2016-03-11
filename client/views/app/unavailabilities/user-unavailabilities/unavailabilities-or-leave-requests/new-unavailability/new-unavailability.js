Template.addNewUnavailability.onCreated(function () {
  this.set('timePickerVisibility', '');
  this.set('isAllDay', false);

  this.set('startTime', moment().toDate());
  this.set('endTime', moment().add(1, 'hours').toDate());

  this.getValuesFromTemplate = function () {
    var date = this.$('.date-picker').datepicker('getDate');
    var startTime = this.get('startTime');
    var endTime = this.get('endTime');
    var repeat = this.$('.repeat-select').val();
    var comment = this.$('.comment-input').val();

    return {
      date: date,
      startTime: startTime,
      endTime: endTime,
      repeat: repeat,
      comment: comment
    };
  };

  this.setTimeToSelectedDate = function (date, time) {
    time = moment(time);
    return moment(date).hours(time.hours()).minutes(time.minutes()).toDate();
  };
});

Template.addNewUnavailability.onRendered(function () {
  var self = this;

  // Get current flyout
  self.currentFlyout = FlyoutManager.getInstanceByElement(self.$('.new-unavailability'));
});

Template.addNewUnavailability.helpers({
  timeComboEditableParams: function () {
    var tmpl = Template.instance();
    return {
      minuteStepping: 10,
      firstTime: tmpl.get('startTime'),
      secondTime: tmpl.get('endTime'),
      onSubmit: function (startTime, endTime) {
        tmpl.set('startTime', startTime);
        tmpl.set('endTime', endTime);
      }
    };
  }
});

Template.addNewUnavailability.events({
  'submit .unavailability-form': function (e, tmpl) {
    e.preventDefault();

    var values = tmpl.getValuesFromTemplate();
    var startDate = tmpl.setTimeToSelectedDate(values.date, values.startTime);
    var endDate = tmpl.setTimeToSelectedDate(values.date, values.endTime);

    if (tmpl.get('isAllDay')) {
      startDate = moment(startDate).startOf('day').toDate();
      endDate = moment(endDate).endOf('day').toDate();
    }

    var unavailability = {
      startDate: startDate,
      endDate: endDate,
      isAllDay: tmpl.get('isAllDay'),
      repeat: values.repeat,
      comment: values.comment
    };

    // close flyout, if success
    Meteor.call('addUnavailability', unavailability, HospoHero.handleMethodResult(function () {
      tmpl.currentFlyout.close();
    }));
  },
  'change .all-day-checkbox': function (event, tmpl) {
    var value = $(event.currentTarget).prop('checked');

    tmpl.set('isAllDay', value);
    var timepickerVisibilityClass = value ? 'hide' : '';
    tmpl.set('timePickerVisibility', timepickerVisibilityClass);
  }
});