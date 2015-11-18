Template.weekPicker.onRendered(function () {
  this.getPickedMoment = function () {
    return moment(this.$(".datepicker").datepicker('getDate'));
  };

  var self = this;

  FlowComponents.callAction('getCurrentWeekDate').then(function (weekDate) {
    var initialDate = HospoHero.dateUtils.getDateByWeekDate(weekDate);
    var datePickerElement = self.$(".date-picker-container");
    datePickerElement.datetimepicker({
      calendarWeeks: true
      //weekStart: 1
      //toggleActive: true,
      //autoclose: true
    });
    self.datePicker = datePickerElement.data("DateTimePicker");
    //datePicker.datepicker("setDate", initialDate);
  });


  this.getWeekDateByMoment = function (dateMoment) {
    return {
      year: dateMoment.year(),
      week: dateMoment.week()
    };
  };

  this.updatePickedMoment = function (weekChange) {
    var currentMoment = this.getPickedMoment();
    console.log('click', weekChange, currentMoment.toDate());

    if (weekChange !== 0) {
      var methodName = weekChange === 1 ? 'add' : 'subtract';
      currentMoment[methodName](1, 'week');
    }

    var weekDate = this.getWeekDateByMoment(currentMoment);

    FlowComponents.callAction('onDateChanged', weekDate).then(function (savedWeekDate) {
      //if (savedWeekDate) {
      //  var date = HospoHero.dateUtils.getDateByWeekDate(savedWeekDate);
      //  this.$(".datepicker").datepicker('setDate', date);
      //}
    });
  };
});


Template.weekPicker.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datePicker.show();
  },

  'click .next-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment(1);
  },

  'click .previous-week': function (event, tmpl) {
    event.preventDefault();
    tmpl.updatePickedMoment(-1);
  },

  'changeDate .datepicker': function (event, tmpl) {
    tmpl.updatePickedMoment(0);
  },

  'show .datepicker': function (event, tmpl) {
    //mark all selected week before showing
    $('.day.active').siblings('.day').addClass('week');
  }
});
