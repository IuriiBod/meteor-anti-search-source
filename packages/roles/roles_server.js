if(Meteor.isServer) {
  Meteor.publish('role', function(roleId) {
    check(roleId, String);
    return Meteor.roles.find({_id: roleId});
  });

  Meteor.publish('roles', function () {
    return Meteor.roles.find();
  });

  Meteor.publish('userRole', function() {
    if(this.userId) {
      check(this.userId, String);

      var user = Meteor.users.findOne(this.userId);

      if (user && user.currentAreaId) {
        return [
          Meteor.roles.find({_id: user.roles[user.currentAreaId]}),
          Meteor.users.find({_id: this.userId}, {
            fields: { relations: 1, roles: 1 }
          })
        ];
      }
      return this.ready();
    }
  });
}