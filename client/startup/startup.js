let registerGlobalSubs = function () {
  Meteor.startup(function () {
    Meteor.subscribe('organizationInfo');
    Meteor.subscribe('todayTasks');
  });
};

if (Meteor.isCordova) {
  // I have no idea why, but Meteor.startup doesn't work
  // with Cordova well in production mode,
  // so I use additional delay to fix it.
  Meteor.setTimeout(registerGlobalSubs, 1000);
} else {
  registerGlobalSubs();
}