Template.notifiText.events({
  'click .confirmClaim': function(event) {
    event.preventDefault();
    var user = $(event.target).closest("a").attr("data-id");
    var shiftId = $(event.target).closest("a").attr("data-shift");
    var shift = Shifts.findOne(shiftId);
    if(shift) {
      Meteor.call("confirmClaim", shiftId, user, function(err) {
        if(err) {
          HospoHero.error(err);
        } else {
          HospoHero.info("Shift claim confirmed");
        }
      });
    }
  },

  'click .rejectClaim': function(event) {
    event.preventDefault();
    var user = $(event.target).closest("a").attr("data-id");
    var shiftId = $(event.target).closest("a").attr("data-shift");
    var shift = Shifts.findOne(shiftId);
    if(shift) {
      Meteor.call("rejectClaim", shiftId, user, function(err) {
        if(err) {
          HospoHero.error(err);
        } else {
          HospoHero.info("Shift claim rejected");
        }
      });
    }
  }
});