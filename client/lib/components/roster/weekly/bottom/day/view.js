Template.weeklyRosterDay.events({
  'click .addShiftBox': function(event) {
    event.preventDefault();
    var day = $(event.target).attr("data-day");
    var weekNo = Router.current().params.week ? Router.current().params.week : moment().week();
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function(day) {
      if(day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    if(day) {
      FlowComponents.callAction("addShift", day, dates);
    }
  }
});
