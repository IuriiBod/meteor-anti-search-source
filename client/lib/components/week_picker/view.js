Template.weekPicker.onRendered(function () {
  var onGetCurrentDate = (function (weekDate) {
    var initialDate = HospoHero.dateUtils.getDateByWeekDate(weekDate);
    this.$(".datepicker").datepicker({
      todayHighlight: true,
      calendarWeeks: true,
      weekStart: 1,
      toggleActive: true
    }).datepicker("setDate", initialDate)
  }).bind(this);

  FlowComponents.callAction('getCurrentWeekDate').then(onGetCurrentDate);

  this.getPickedMoment = (function () {
    return moment(this.$(".datepicker").datepicker('getDate'));
  }).bind(this);

  this.updatePickedMoment = (function (weekChange) {
    var currentMoment = this.getPickedMoment();

    var weekNumber = currentMoment.week();
    if (isFinite(weekChange)) {
      weekNumber += weekChange;
    }

    var year = currentMoment.year();

    FlowComponents.callAction('onDateChanged', {
      year: year,
      week: weekNumber
    }).then(function (savedWeekDate) {
      if (savedWeekDate) {
        this.$(".datepicker").datepicker('setDate', HospoHero.dateUtils.getDateByWeekDate(savedWeekDate))
      }
    });
  }).bind(this);
});


Template.weekPicker.events({
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
    $(".day.active").siblings(".day").addClass("week");
  }
});
