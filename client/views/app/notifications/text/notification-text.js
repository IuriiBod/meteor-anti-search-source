Template.notifiText.onCreated(function () {
  this.set('notifi', this.data.notification);
});

Template.notifiText.events({
  'click .readNotification': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.notification._id;
    Meteor.call("readNotifications", id, HospoHero.handleMethodResult());
  }
});