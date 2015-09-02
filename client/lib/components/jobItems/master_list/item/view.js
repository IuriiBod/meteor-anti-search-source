Template.jobItemDetailed.events({
  'click .viewDetail': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Router.go("jobItemDetailed", {_id: id});
  },
  'click .archive': function(e, tpl) {
    e.preventDefault();

    var button, i, id;
    if($(e.target).hasClass('archive')) {
      button = $(e.target);
      i = button.find('.fa');
    } else {
      i = $(e.target);
      button = i.parent();
    }
    id = button.parent().parent().attr("data-id");
    Meteor.call("archiveJobItem", id, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
    JobItemsSearch.cleanHistory();
    var selector = {
      "type": Session.get("type"),
      limit: 30
    };
    if(Router.current().params.type) {
      selector.status = 'archived';
    } else {
      selector.status = {$ne: 'archived'};
    }
    var text = $("#searchJobItemsBox").val().trim();
    JobItemsSearch.search(text, selector);
  }
});
