Template.menuItemsListMainView.events({
  'click #submitMenuItem': function(event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  },

  'click .subscribeMenuList': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "menulist", function(err) {
      if(err) {
        HospoHero.alert(err);
      }
    });
  },

  'click .unSubscribeMenuList': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "menulist", function(err) {
      if(err) {
        HospoHero.alert(err);
      }
    });
  }
});

Template.menuItemsListMainView.helpers({
  'isSubscribed': function() {
    var result = Subscriptions.findOne({"_id": "menulist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  }
});