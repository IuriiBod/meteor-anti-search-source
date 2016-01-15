//context: year (number), week (number), onDateChanged (Function)
Template.weekPicker.onCreated(function () {
  this.date = this.data.date;
  this.oldDate = getWeekDateByMoment(this.date);
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
    dateChangeStep = _.isUndefined(dateChangeStep) ? 7 : dateChangeStep;

    var currentMoment = moment(this.datePicker.datepicker('getDate'));
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
      this.date = date;
      if (_.isFunction(this.data.onDateChanged)) {
        this.data.onDateChanged(date);
      }
      this.oldDate = date;
    }
  };

  //init bootstrap date picker

  var initialPlainDate = this.date;
  this.datePicker = this.$(".date-picker-input");

  this.datePicker.datepicker({
    calendarWeeks: true,
    format: 'yyyy-mm-dd',
    todayHighlight: true,
    weekStart: 1
  });

  this.datePicker.datepicker('setDate', initialPlainDate.toDate());
});


Template.weekPicker.helpers({
  date: function () {
    return Template.instance().date;
  },

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
    tmpl.datePicker.datepicker('show');
  },

  'click .next-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment('add');
  },

  'click .previous-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment('subtract');
  },

  'changeDate .date-picker-input': function (event, tmpl) {
    tmpl.updatePickedMoment(null, 0);
    tmpl.datePicker.datepicker('hide');
  },

  'show .date-picker-input': function (event, tmpl) {
    //mark all selected week before showing
    var activeDayClass = $('.day.active').length === 0 ? '.day.today' : '.day.active';
    $(activeDayClass).siblings('.day').addClass('week');
  }
});

var getWeekDateByMoment = function (dateMoment) {
  return HospoHero.dateUtils.shortDateFormat(dateMoment);
};