var sub = new SubsManager();
// Run this when the meteor app is started
Meteor.startup(function () {
  sub.subscribe("profileUser", Meteor.userId());
  Session.set("notifiState", false);
  Session.set("shiftState", "future");

  //var user = Meteor.user();
  //if(!user.isAdmin && !user.isManager) {
  //  Session.set('organizationId', '');
  //} else {
  //  if(!Session.get('organizationId')) {
  //    Session.set('organizationId', '');
  //  }
  //}
});

