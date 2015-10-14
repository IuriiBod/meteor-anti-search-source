Template.schedulingShift.events({
  'change .shiftAssign': function(event) {
    var workerId = $(event.target).val();
    if(workerId == "null") {
      workerId = null;
    }
    var shiftId = $(event.target).attr("data-id");
    Meteor.call("assignWorker", workerId, shiftId, function(err) {
      if(err) {
        HospoHero.error(err);
      }
    });
  },

  'click .shift-profile': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisShift", id);
    $("#shiftProfile").modal();
  }
});