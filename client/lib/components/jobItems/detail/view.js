Template.jobItemDetail.events({
  'click .editJobItemBtn': function(event) {
    event.preventDefault();
    Router.go("jobItemEdit", {'_id': Session.get("thisJobItem")});
  },

  'click .printJobItemBtn': function(event) {
    event.preventDefault();
    print();
  }, 

  'click .subscribeJobItemBtn': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("subscribe", id, HospoHero.handleMethodResult());
  },

  'click .unSubscribeJobItemBtn': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("unSubscribe", id, HospoHero.handleMethodResult());
  }
});