Meteor.publish('currentOrganization', function() {
  if(this.userId) {
    var user = Meteor.users.findOne(this.userId);
    if(user.relations && user.relations.organizationId) {
      return Organizations.find({_id: user.relations.organizationId});
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});