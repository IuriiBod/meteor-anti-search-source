if(Meteor.isServer) {
  Meteor.publish('role', function(roleId) {
    check(roleId, String);
    return Meteor.roles.find({_id: roleId});
  });

  Meteor.publish('roles', function () {
    return Meteor.roles.find();
  });

  Meteor.publish('userRole', function() {
    check(this.userId, String);

    var user = Meteor.users.findOne(this.userId, {
      fields: { currentArea: 1, relationIds: 1 }
    });

    if (user && user.currentArea) {
      return [
        Meteor.roles.find({_id: user.relationIds[user.currentArea]}),
        Meteor.users.find({_id: this.userId}, {
          fields: { relationIds: 1 }
        })
      ];
    }
    return this.ready();
  });
}