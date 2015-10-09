Template.shiftItem.events({
  'click .claimShift': function(event) {
    event.preventDefault();
    var shiftId = $(event.target).closest("tr").attr("data-id");
    var shift = Shifts.findOne(shiftId);
    if(shiftId && shift) {
      Meteor.call("claimShift", shiftId, function(err) {
        if(err) {
          HospoHero.alert(err);
        } else {
          var text = "Shift on " + moment(shift.shiftDate).format("ddd, Do MMMM");
          var options = {
            "title": text + " has been claimed by following workers",
            "type": "claim"
          };
          Meteor.call("sendNotifications", shiftId, "roster", options, function(err) {
            if(err) {
              HospoHero.alert(err);
            } 
          });
        }
      });
    }
  }
});