Template.weekSelector.rendered = function () {
  $('.i-checks').iCheck({
    radioClass: 'iradio_square-green'
  });
};

Template.weekSelector.events({
  'click .saveShifts': function (event) {
    event.preventDefault();
    var weekNo = Session.get("templateToWeek");
    var week = getDatesFromWeekNumber(weekNo);
    var dates = [];
    week.forEach(function (day) {
      if (day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });

    week.forEach(function (obj) {
      var index = HospoHero.dateUtils.shiftDate(moment().day(obj.day),true);
      var shifts = Shifts.find({
        startTime: TimeRangeQueryBuilder.forDay(index),
        type: 'template'
      }, {
        sort: {order: 1}
      }).fetch();

      if (shifts.length > 0) {
        shifts.forEach(function (shift) {
          var startHour = moment(shift.startTime).hour();
          var startMin = moment(shift.startTime).minute();

          var endHour = moment(shift.endTime).hour();
          var endMin = moment(shift.endTime).minute();

          var info = {
            "startTime": moment(obj.date).hour(startHour).minute(startMin).toDate(),
            "endTime": moment(obj.date).hour(endHour).minute(endMin).toDate(),
            "section": shift.section,
            "assignedTo": shift.assignedTo,
            "week": dates,
            "order": shift.order
          };

          Meteor.call("createShift", info, HospoHero.handleMethodResult(function () {
            $("#notifiModal").modal("show");
          }));
        });
      }
    });
  },

  'click .checklist-content': function (event) {
    var checked = $(event.target).is(":checked");
    Session.set("templateToWeek", $(event.target).val());
    Session.set("templateToYear", $(event.target).attr("data-year"));
  }
});