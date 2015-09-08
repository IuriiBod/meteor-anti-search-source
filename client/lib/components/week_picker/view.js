Template.weekPicker.onRendered(function () {
  var onGetCurrentDate = (function (initialDate) {
    this.$(".datepicker").datepicker({
      todayHighlight: true,
      calendarWeeks: true,
      weekStart: 1,
      toggleActive: true
    }).datepicker("setDate", initialDate)
      .datepicker("fill");
  }).bind(this);

  FlowComponents.callAction('getCurrentDate').then(onGetCurrentDate);

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

    FlowComponents.callAction('onDateChanged', year, weekNumber).then(function (savedDate) {
      if (savedDate) {
        this.$(".datepicker").datepicker('setDate', savedDate)
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
  }
});
