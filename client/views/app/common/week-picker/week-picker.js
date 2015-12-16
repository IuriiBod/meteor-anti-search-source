//context: year (number), week (number), onDateChanged (Function)
Template.weekPicker.onCreated(function () {
  var weekDate = {
    week: this.data.week,
    year: this.data.year
  };

  this.oldDateWeek = weekDate;
  this.set('weekDate', weekDate);
});


Template.weekPicker.onRendered(function () {
  this.isSameAsOldWeekDate = function (newDateWeek) {
    var newDateMoment = getMomentByWeekDate(newDateWeek);
    var oldDateMoment = getMomentByWeekDate(this.oldDateWeek);
    newDateMoment = newDateMoment.isoWeekday(1);
    oldDateMoment = oldDateMoment.isoWeekday(1);

    return newDateMoment.week() === oldDateMoment.week() && newDateMoment.year() === oldDateMoment.year();
  };

  this.updatePickedMoment = function (weekChange) {
    var currentMoment = moment(this.datePicker.date().toDate());

    var applyChangeToCurrentMoment = function () {
      var methodName = weekChange === 1 ? 'add' : 'subtract';
      currentMoment[methodName](1, 'week');
    };

    if (weekChange !== 0) {
      applyChangeToCurrentMoment();
      if (this.isSameAsOldWeekDate(getWeekDateByMoment(currentMoment))) {
        applyChangeToCurrentMoment();
      }
    }

    var weekDate = getWeekDateByMoment(currentMoment);

    if (!this.isSameAsOldWeekDate(weekDate)) {
      this.set('weekDate', weekDate);
      if (_.isFunction(this.data.onDateChanged)) {
        this.data.onDateChanged(weekDate);
      }
      this.oldDateWeek = weekDate;
    }
  };

  //init bootstrap date picker

  var initialPlainDate = HospoHero.dateUtils.getDateByWeekDate(this.get('weekDate'));
  var datePickerElement = this.$(".date-picker-input");

  datePickerElement.datetimepicker({
    calendarWeeks: true,
    format: 'YYYY-MM-DD'
  });

  this.datePicker = datePickerElement.data("DateTimePicker");
  this.datePicker.date(moment(initialPlainDate));
});


Template.weekPicker.helpers({
  weekDateStr: function (weekDate) {
    var weekStartEnd = moment().set('year', weekDate.year).set('week', weekDate.week);
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
    currentDate += ", week " + weekDate.week;
    return currentDate.toUpperCase();
  }
});


Template.weekPicker.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datePicker.toggle();
  },

  'click .next-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment(1);
  },

  'click .previous-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment(-1);
  },

  'dp.change .date-picker-input': function (event, tmpl) {
    tmpl.updatePickedMoment(0);
  },

  'dp.show .date-picker-input': function (event, tmpl) {
    //mark all selected week before showing
    $('.day.active').siblings('.day').addClass('week');
  }
});

var getWeekDateByMoment = function (dateMoment) {
  return {
    year: dateMoment.year(),
    week: dateMoment.week()
  };
};

var getMomentByWeekDate = function (weekDate) {
  return moment().set(weekDate);
};