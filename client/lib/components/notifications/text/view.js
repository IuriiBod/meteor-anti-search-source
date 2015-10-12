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
          var text = "Shift claim on " + moment(shift.shiftDate).format("ddd, Do MMMM") + " has been confirmed";
          var options = {
            "title": text,
            "type": "confirm"
          };
          Meteor.call("sendNotifications", shiftId, "roster", options, function(err) {
            if(err) {
              HospoHero.error(err);
            } 
          });
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
          var text = "Shift claim on " + moment(shift.shiftDate).format("ddd, Do MMMM") + " has been rejected";
          var options = {
            "title": text,
            "type": "reject",
            "rejected": user
          };
          Meteor.call("sendNotifications", shiftId, "roster", options, function(err) {
            if(err) {
              HospoHero.error(err);
            } 
          });
        }
      });
    }
  }
});