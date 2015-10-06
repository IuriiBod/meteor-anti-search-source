Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.users.find({"_id": this.userId}, {
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
    this.ready();
  }
});

Meteor.publish(null, function() {
  if(this.userId) {
    var user = Meteor.users.findOne(this.userId);
    if(user.relations && user.relations.organizationId) {
      var orgId = user.relations.organizationId;

      var cursors = [
        Organizations.find({_id: orgId}),
        Locations.find({organizationId: orgId}),
        Areas.find({organizationId: orgId}),
        Meteor.roles.find({
          $or: [
            { default: true },
            { "relations.organizationId": orgId }
          ]
        })
      ];

      if(user.currentAreaId) {
        cursors.push(Meteor.users.find({"relations.areaIds": user.currentAreaId}));

        cursors.push(Notifications.find({
          ref: this.userId,
          read: false,
          "relations.areaId": user.currentAreaId
        }));

        cursors.push(Invitations.find({organizationId: orgId}));
      }
      return cursors;
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});