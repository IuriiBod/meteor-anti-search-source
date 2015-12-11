Template.notifiFlyout.helpers({
  count: function () {
    return !!Notifications.findOne({read: false, to: Meteor.userId()});
  },
  notifications: function () {
    return Notifications.find({
      read: false,
      to: Meteor.userId()
    }, {
      sort: {
        createdOn: -1
      }
    });
  }
});

Template.notifiFlyout.events({
  'click .markAllAsRead': function (event) {
    event.preventDefault();
    var notifi = Notifications.find({"read": false, "to": Meteor.userId()}).fetch();
    notifi.forEach(function (not) {
      Meteor.call("readNotifications", not._id, HospoHero.handleMethodResult());
    });
  }
});