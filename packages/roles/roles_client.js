if(Meteor.isClient) {
  Meteor.role = function () {
    var user = Meteor.user();
    if (user && user.currentArea) {
      var roleId = user.relationIds[user.currentArea];
      var role = Meteor.roles.findOne(user.roleId);
      return role !== undefined ? role : null;
    }
    return null;
  };

  Meteor.roleId = function () {
    var role = Meteor.role();
    return role ? role._id : null;
  };

  Tracker.autorun(function () {
    if (Meteor.userId()) {
      Meteor.subscribe('userRole');
    }
  });

  Template.registerHelper('canUser', function (perms) {
    return Roles.canUser(perms);
  });
}