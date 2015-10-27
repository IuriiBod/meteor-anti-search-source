Template.menuItemsListMainView.events({
  'click #submitMenuItem': function(event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  },

  'click .subscribeMenuList': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "menulist", HospoHero.handleMethodResult());
  },

  'click .unSubscribeMenuList': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "menulist", HospoHero.handleMethodResult());
  }
});

Template.menuItemsListMainView.helpers({
  'isSubscribed': function() {
    var result = Subscriptions.findOne({"_id": "menulist", "subscribers": Meteor.userId()});
    return !!result;
  }
});