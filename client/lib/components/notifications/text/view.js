Template.notifiText.events({
  'click .confirmClaim': function(event) {
    event.preventDefault();
    var user = $(event.target).closest("a").attr("data-id");
    var shiftId = $(event.target).closest("a").attr("data-shift");
    var shift = Shifts.findOne(shiftId);
    if(shift) {
      Meteor.call("confirmClaim", shiftId, user, HospoHero.handleMethodResult(function() {
        HospoHero.info("Shift claim confirmed");
      }));
    }
  },

  'click .rejectClaim': function(event) {
    event.preventDefault();
    var user = $(event.target).closest("a").attr("data-id");
    var shiftId = $(event.target).closest("a").attr("data-shift");
    var shift = Shifts.findOne(shiftId);
    if(shift) {
      Meteor.call("rejectClaim", shiftId, user, HospoHero.handleMethodResult(function() {
        HospoHero.info("Shift claim rejected");
      }));
    }
  },

  'click .readNotification': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("readNotifications", id, HospoHero.handleMethodResult());
  }
});