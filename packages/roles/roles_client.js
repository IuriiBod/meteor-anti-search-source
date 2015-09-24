if(Meteor.isClient) {
  Meteor.role = function () {
    var user = Meteor.user();
    if (user && user.defaultArea) {
      var role = Meteor.roles.findOne({_id: user.roles[user.defaultArea]});
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

  Tracker.autorun(function () {
    if (Meteor.userId()) {
      Meteor.subscribe('roles');
    }
  });

  Template.registerHelper('canUser', function (perms) {
    return Roles.canUser(perms);
  });
}