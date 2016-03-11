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

    var notificationsCursor = Notifications.find({read: false, to: Meteor.userId()});
    notificationsCursor.forEach(function (notification) {
      Meteor.call('readNotifications', notification._id, HospoHero.handleMethodResult());
    });
  },

  'click .notifications-list a[data-link-type="navigation"]': function (event) {
    //close flyout if notification navigation link was clicked (UX improvement for mobile)
    let notificationsFlyout = FlyoutManager.getInstanceByElement(event.target);
    notificationsFlyout.close();
  }
});