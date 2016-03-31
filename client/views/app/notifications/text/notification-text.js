Template.notifiText.helpers({
  timeFromNow: function (time) {
    return moment(time).fromNow();
  }
});

Template.notifiText.events({
  'click .readNotification': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.notification._id;
    Meteor.call("readNotifications", id, HospoHero.handleMethodResult());
  }
});