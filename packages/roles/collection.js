Meteor.roles = new Mongo.Collection('userRoles');

var checkPermissions = function() {
  if(Meteor.userId()) {
    var adminRole = Meteor.roles.findOne({name: 'Admin'});
    if (adminRole) {
      return Meteor.user.find({
          _id: Meteor.userId(),
          "roles.defaultRole": adminRole._id
        }).count() > 0;
    }
  }
  return false;
};

Meteor.roles.allow({
  insert: function () {
    return checkPermissions();
  },
  update:  function () {
    return checkPermissions();
  },
  remove:  function () {
    return checkPermissions();
  }
});