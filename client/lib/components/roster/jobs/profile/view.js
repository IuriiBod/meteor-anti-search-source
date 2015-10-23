Template.jobProfile.events({
  'click .deleteJob': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var shiftId = Session.get("shiftId");
    if(!id) {
      return alert("Job does not have an id");
    } else {
      var confirmDelete = confirm("Are you sure you want to delete this job ?");
      if(confirmDelete) {
        Meteor.call("deleteJob", id, shiftId, HospoHero.handleMethodResult(function() {
          $("#jobProfile").modal("hide");
        }));
      }
    }
  }
});