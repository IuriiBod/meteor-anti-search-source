Meteor.roles = new Mongo.Collection('userRoles');

var checkPermissions = function() {
  if(Meteor.userId()) {
    var roles = Meteor.roles.find({
      $or: [
        { name: 'Owner' },
        { name: 'Manager' }
      ]
    }).fetch();


    if(roles.length) {
      roles = _.map(roles, function(role) {
        return role._id;
      });

      var tempObj = {};
      var user = Meteor.users.findOne(Meteor.userId());
      tempObj["roles." + user.defaultArea] = { $in: roles };

      return !!Meteor.users.findOne({
        _id: Meteor.userId(),
        $or: [
          { "roles.defaultRole": { $in: roles } },
          tempObj
        ]
      });
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