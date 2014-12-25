Template.jobProfile.helpers({
  'job': function() {
    var job = Session.get("thisJob");
    return job;
  }
});

Template.jobProfile.events({
  'submit form': function(e, instance) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();;
    var details = $(event.target).find('[name=details]').val();
    var portions = $(event.target).find('[name=portions]').val();;
    var activeTime = $(event.target).find('[name=activeTime]').val();
    var ingCost = $(event.target).find('[name=ingCost]').val();
    var shelfLife = $(event.target).find('[name=shelfLife]').val();

    if(!name || name.trim() == "") {
      alert("Please add title for your job");
    } else if(!activeTime || activeTime.trim() == "") {
      alert("Please add active time for your job");
    } else {
      var info = {
        "_id": $(e.target).attr("data-id"),
        "name": name,
        "type": type,
        "details": details,
        "portions": portions,
        "activeTime": activeTime,
        "ingCost": ingCost,
        "shelfLife": shelfLife
      }
      Meteor.call("editJob", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#jobProfile").modal("hide");
        }
      });
    }
  }
});