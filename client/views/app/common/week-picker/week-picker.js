//context: year (number), week (number), onDateChanged (Function)
Template.weekPicker.onCreated(function () {
  this.oldDate = getWeekDateByMoment(this.data.date);
  this.dayStep = this.data.type === 'day' ? 1 : 7;
});


Template.weekPicker.onRendered(function () {
  this.isSameAsOldWeekDate = function (newDate) {
    return newDate === this.oldDate;
  };

  /**
   * Update picked moment after changing date in datepicker
   * @param {String} [action=add|subtract] - action to do with current date. null for do nothing.
   * @param {Number} [dateChangeStep] - number of days to add/subtract
   */
  this.updatePickedMoment = function (action, dateChangeStep) {
    dateChangeStep = dateChangeStep || this.dayStep;

    var currentMoment = moment(this.datePicker.datepicker('getDate'));

    if (this.data.type !== 'day') {
      currentMoment = HospoHero.dateUtils.startOfWeekMoment(currentMoment);
    }

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
      if (_.isFunction(this.data.onDateChanged)) {
        this.data.onDateChanged(date);
      }
      this.oldDate = date;
    }
  };

  //init bootstrap date picker

  var initialPlainDate = this.data.date;
  this.datePicker = this.$(".date-picker-input");

  this.datePicker.datepicker({
    format: 'yyyy-mm-dd'
  });

  this.datePicker.datepicker('setDate', moment(initialPlainDate).toDate());
});


Template.weekPicker.helpers({
  weekDateStr: function (date) {
    var currentDate;

    if (this.type !== 'day') {
      var weekStartEnd = moment(date);
      var firstDay = moment(weekStartEnd).startOf('isoweek');
      var lastDay = moment(weekStartEnd).endOf('isoweek');

      if (firstDay.year() !== lastDay.year()) {
        currentDate = firstDay.format('D MMM YYYY - ') + lastDay.format('D MMM YYYY');
      } else {
        if (firstDay.month() !== lastDay.month()) {
          currentDate = firstDay.format('D MMM - ') + lastDay.format('D MMM YYYY');
        } else {
          currentDate = firstDay.format('D - ') + lastDay.format('D MMM YYYY');
        }
      }
      //currentDate += ", week " + weekStartEnd.week();
    } else {
      currentDate = HospoHero.dateUtils.dayFormat(date);
    }

    return currentDate.toUpperCase();
  },
  numberOfWeekStr: function (date) {
    var numberOfWeek = moment(date).week();
    return 'WEEK ' + numberOfWeek;
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
    if (tmpl.data.type !== 'day') {
      //mark all selected week before showing
      var activeDayClass = $('.day.active').length === 0 ? '.day.today' : '.day.active';
      $(activeDayClass).siblings('.day').addClass('week');
    }
  }
});

var getWeekDateByMoment = function (dateMoment) {
  return HospoHero.dateUtils.shortDateFormat(dateMoment);
};