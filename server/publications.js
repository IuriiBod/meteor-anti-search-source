Meteor.publish(null, function () {
  if (this.userId) {
    var user = Meteor.users.findOne({_id: this.userId});
    if (user && user.relations && user.relations.organizationId) {
      var orgId = user.relations.organizationId;
      return [
        Meteor.roles.find({
          $or: [
            {default: true},
            {organizationId: orgId}
          ]
        }),

        Organizations.find({_id: orgId}),

        Locations.find({organizationId: orgId}),

        Areas.find({organizationId: orgId}),

        Invitations.find({organizationId: orgId}),

        Meteor.users.find({
          "relations.organizationId": orgId
        }),

        Notifications.find({
          ref: Meteor.userId(),
          read: false,
          "relations.organizationId": orgId
        })
      ];
    } else {
      return Meteor.roles.find({default: true});
    }
  }
});

Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.users.find({"_id": id}, {
      fields: {
        "services.google": 1,
        roles: 1,
        isActive: 1,
        profile: 1,
        username: 1,
        createdAt: 1,
        currentAreaId: 1,
        relations: 1
      }
    });
  } else {
    this.stop();
  }
});