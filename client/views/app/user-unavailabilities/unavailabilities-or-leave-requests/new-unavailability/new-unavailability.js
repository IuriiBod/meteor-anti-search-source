Template.addNewUnavailability.onCreated(function () {
  this.set('timePickerVisibility', '');
  this.set('isAllDay', false);

  this.getValuesFromTemplate = function () {
    var date = this.$('.date-picker').data('DateTimePicker').date();
    var startTime = this.$('.start-time-picker').data('DateTimePicker').date();
    var endTime = this.$('.end-time-picker').data('DateTimePicker').date();
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

  this.getDateFromDateAndTimePickers = function (date, time) {
    return moment(date).hours(time.hours()).minutes(time.minutes()).toDate();
  }
});

Template.addNewUnavailability.onRendered(function () {
  var self = this;

  // Get current flyout
  self.currentFlyout = FlyoutManager.getInstanceByElement(self.$('.new-unavailability'));

  // Define a dateTimePickers
  self.$('.date-picker').datetimepicker({
    format: 'YYYY MMM Do',
    minDate: moment(),
    defaultDate: moment()
  });
  self.$('.start-time-picker').datetimepicker({
    format: 'HH:mm',
    stepping: 10,
    defaultDate: moment()
  });
  self.$('.end-time-picker').datetimepicker({
    format: 'HH:mm',
    stepping: 10,
    defaultDate: moment().add(1, 'hours'),
    minDate: moment().add(10, 'minutes')
  });

  self.$('.start-time-picker').on("dp.change", function (e) {
    var endTimePicker = self.$('.end-time-picker').data("DateTimePicker");

    endTimePicker.minDate(e.date.add(10, 'minutes'));

    if (endTimePicker.minDate() > endTimePicker.date()) {
      endTimePicker.date(endTimePicker.minDate());
    }
  });
});

Template.addNewUnavailability.events({
  'submit .unavailability-form': function (e, tmpl) {
    e.preventDefault();

    var values = tmpl.getValuesFromTemplate();
    var startDate = tmpl.getDateFromDateAndTimePickers(values.date, values.startTime);
    var endDate = tmpl.getDateFromDateAndTimePickers(values.date, values.endTime);

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