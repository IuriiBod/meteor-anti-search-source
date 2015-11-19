Template.weekPicker.onRendered(function () {
  var self = this;

  FlowComponents.callAction('getCurrentWeekDate').then(function (weekDate) {
    self.oldDateWeek = weekDate;

    var initialDate = moment(HospoHero.dateUtils.getDateByWeekDate(weekDate));
    var datePickerElement = self.$(".date-picker-input");

    datePickerElement.datetimepicker({
      calendarWeeks: true,
      format: 'YYYY-MM-DD'
    });
    self.datePicker = datePickerElement.data("DateTimePicker");
    self.datePicker.date(initialDate);
  });

  this.isSameAsOldWeekDate = function (newDateWeek) {
    return newDateWeek.week === this.oldDateWeek.week && newDateWeek.year === this.oldDateWeek.year;
  };


  this.getWeekDateByMoment = function (dateMoment) {
    return {
      year: dateMoment.year(),
      week: dateMoment.week()
    };
  };

  this.updatePickedMoment = function (weekChange) {
    var currentMoment = moment(this.datePicker.date().toDate());

    var applyChangeToCurrentMoment = function () {
      var methodName = weekChange === 1 ? 'add' : 'subtract';
      currentMoment[methodName](1, 'week');
    };

    if (weekChange !== 0) {
      applyChangeToCurrentMoment();
      if (this.isSameAsOldWeekDate(this.getWeekDateByMoment(currentMoment))) {
        applyChangeToCurrentMoment();
      }
    }

    var weekDate = this.getWeekDateByMoment(currentMoment);

    if (!this.isSameAsOldWeekDate(weekDate)) {
      FlowComponents.callAction('onDateChanged', weekDate);
      self.oldDateWeek = weekDate;
    }
  };
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
