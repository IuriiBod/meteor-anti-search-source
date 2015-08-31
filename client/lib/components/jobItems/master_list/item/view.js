Template.jobItemDetailed.events({
  'click .viewDetail': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Router.go("jobItemDetailed", {_id: id});
  },
  'click .archive': function(e, tpl) {
    e.preventDefault();
    var id = tpl.$(e.target).parent().parent().attr("data-id");
    Meteor.call("archiveJobItem", id, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
  }
});
