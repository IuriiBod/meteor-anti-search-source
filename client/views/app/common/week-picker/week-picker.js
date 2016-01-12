//context: year (number), week (number), onDateChanged (Function)
Template.weekPicker.onCreated(function () {
  var date = this.data.date;
  this.oldDate = date;
  this.set('date', date);
});


Template.weekPicker.onRendered(function () {
  this.isSameAsOldWeekDate = function (newDate) {
    return newDate === this.oldDate;
  };

  /**
   * Update picked moment after changing date in datepicker
   * @param {String} [action=add|subtract] - action to do with current date. null for do nothing.
   * @param {Number} [dateChangeStep=7] - number of days to add/subtract
   */
  this.updatePickedMoment = function (action, dateChangeStep) {
    dateChangeStep = dateChangeStep || 7;

    var currentMoment = moment(this.datePicker.date().toDate());
    currentMoment = HospoHero.dateUtils.startOfWeekMoment(currentMoment);

    var applyChangeToCurrentMoment = function () {
      if (action) {
        currentMoment[action](dateChangeStep, 'days');
      }
    };

    if (dateChangeStep !== 0) {
      applyChangeToCurrentMoment();
      if (this.isSameAsOldWeekDate(getWeekDateByMoment(currentMoment))) {
        applyChangeToCurrentMoment();
      }
    }

    var date = getWeekDateByMoment(currentMoment);

    if (!this.isSameAsOldWeekDate(date)) {
      this.set('date', date);
      if (_.isFunction(this.data.onDateChanged)) {
        this.datePicker.date(moment(date));
        this.data.onDateChanged(date);
      }
      this.oldDate = date;
    }
  };

  //init bootstrap date picker

  var initialPlainDate = this.get('date');
  var datePickerElement = this.$(".date-picker-input");

  datePickerElement.datetimepicker({
    calendarWeeks: true,
    format: 'YYYY-MM-DD'
  });

  this.datePicker = datePickerElement.data("DateTimePicker");
  this.datePicker.date(moment(initialPlainDate));
});


Template.weekPicker.helpers({
  weekDateStr: function (date) {
    var weekStartEnd = moment(date);
    var firstDay = moment(weekStartEnd).startOf('isoweek');
    var lastDay = moment(weekStartEnd).endOf('isoweek');

    var currentDate;
    if (firstDay.year() != lastDay.year()) {
      currentDate = firstDay.format('D MMM YYYY - ') + lastDay.format('D MMM YYYY');
    } else {
      if (firstDay.month() != lastDay.month()) {
        currentDate = firstDay.format('D MMM - ') + lastDay.format('D MMM YYYY');
      } else {
        currentDate = firstDay.format('D - ') + lastDay.format('D MMM YYYY');
      }
    }
    currentDate += ", week " + weekStartEnd.week();
    return currentDate.toUpperCase();
  }
});


Template.weekPicker.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datePicker.toggle();
  },

  'click .next-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment('add');
  },

  'click .previous-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment('subtract');
  },

  'dp.change .date-picker-input': function (event, tmpl) {
    tmpl.updatePickedMoment();
  },

  'dp.show .date-picker-input': function (event, tmpl) {
    //mark all selected week before showing
    $('.day.active').siblings('.day').addClass('week');
  }
});

var getWeekDateByMoment = function (dateMoment) {
  return HospoHero.dateUtils.shortDateFormat(dateMoment);
};