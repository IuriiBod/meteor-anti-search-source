Meteor.role = function () {
  if(!Meteor.userId()) {
    return null;
  }

  var user = Meteor.users.findOne(Meteor.userId());
  if (user && user.roles) {
    var roleId;
    if (user.defaultArea) {
      roleId = user.roles[user.defaultArea];
    } else if(user.roles.defaultRole) {
      roleId = user.roles.defaultRole;
    }
    var role = Meteor.roles.findOne({_id: roleId});
    return role !== undefined ? role : null;
  }
  return null;
};

Meteor.roleId = function () {
  var role = Meteor.role();
  return role ? role._id : null;
};

if(Meteor.isClient) {
  Tracker.autorun(function () {
    if (Meteor.userId()) {
      Meteor.subscribe('userRole');
    }
  });

  Tracker.autorun(function () {
    if (Meteor.userId()) {
      Meteor.subscribe('roles');
    }
  });

  Template.registerHelper('canUser', function (perms) {
    return Roles.canUser(perms);
  });
}