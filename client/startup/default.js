Meteor.startup(function () {
  Session.set("notifiState", false);
  Session.set("shiftState", "future");
});