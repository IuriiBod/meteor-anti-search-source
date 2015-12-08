Template.shiftItem.events({
  'click .claimShift': function (event) {
    event.preventDefault();
    var shiftId = $(event.target).closest("tr").attr("data-id");
    var shift = Shifts.findOne(shiftId);
    if (shiftId && shift) {
      Meteor.call("claimShift", shiftId, HospoHero.handleMethodResult());
    }
  }
});