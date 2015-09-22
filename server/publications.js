Meteor.publish(null, function(){
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
      Meteor.users.find({}, {fields: {username: 1, services: 1}})
    ];
  } else {
    return Meteor.roles.find({ default: true });
  }
});