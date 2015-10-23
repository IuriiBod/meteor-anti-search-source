Template.teamHoursItem.events({
  'click .stopCurrentShift': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-shift");
    var confirmClockout = confirm("Are you sure you want to clockout this shift ?");
    if(confirmClockout && id) {
      Meteor.call("clockOut", id, HospoHero.handleMethodResult());
    }
  }
});