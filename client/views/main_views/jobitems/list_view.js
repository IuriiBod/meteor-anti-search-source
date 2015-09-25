Template.jobItemsListMainView.events({
  'click #submitJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click .subscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .unSubscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .jobtypesPanel>li': function(e, tpl) {
    Session.set("type", $(e.target).parent().attr("data-id"));
    JobItemsSearch.cleanHistory();
    var selector = {
      "type": Session.get("type"),
      limit: 30
    };
    selector.status = Router.current().params.type ? 'archived' : {$ne: 'archived'};
    var text = $("#searchJobItemsBox").val().trim();
    JobItemsSearch.search(text, selector);
  }
});

Template.jobItemsListMainView.helpers({
  'isSubscribed': function() {
    var result = Subscriptions.findOne({"_id": "joblist", "subscribers": Meteor.userId()});
    return !!result;
  },

  jobTypes: function() {
    return JobTypes.find({}, {sort: {"name": 1}});
  }
});

Template.jobItemsListMainView.rendered = function() {
  $(".jobtypesPanel").find("li").first().addClass("active");
  if($(".jobtypepanes") && $(".jobtypepanes").length > 0) {
    var elem = $(".jobtypepanes")[0];
    $(elem).addClass("active");
    Session.set("type", $(elem).attr("id"));
  }
};
