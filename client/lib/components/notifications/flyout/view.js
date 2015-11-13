Template.notifiFlyout.events({
  'click .markAllAsRead': function (event) {
    event.preventDefault();
    var notifi = Notifications.find({"read": false, "to": Meteor.userId()}).fetch();
    notifi.forEach(function (not) {
      Meteor.call("readNotifications", not._id, HospoHero.handleMethodResult());
    });
  }
});