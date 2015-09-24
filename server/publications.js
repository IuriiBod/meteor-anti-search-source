Meteor.publish(null, function(){
  if(this.userId) {
    var user = Meteor.users.findOne({_id: this.userId});
    if(user && user.relations && user.relations.organizationId) {
      var orgId = user.relations.organizationId;
      return [
        Meteor.roles.find({$or: [
          { default: true },
          { organizationId: orgId }
        ]}),
        Organizations.find({_id: orgId}),
        Locations.find({organizationId: orgId}),
        Areas.find({organizationId: orgId}),
        Invitations.find({organizationId: orgId}),
        Meteor.users.find({
          "relations.organizationId": orgId
        })
      ];
    } else {
      return Meteor.roles.find({ default: true });
    }
  }
});