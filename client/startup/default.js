var sub = new SubsManager();
// Run this when the meteor app is started
Meteor.startup(function () {

  if(Meteor.userId()) {
    sub.subscribe("profileUser", Meteor.userId());
  }

  Session.set("notifiState", false);
  Session.set("shiftState", "future");
  Session.set('locationId', '');
  Session.set('areaId', '');
});