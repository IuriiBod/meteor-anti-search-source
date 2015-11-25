Meteor.publish('areasOfOrganization', function () {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    if (user && user.relations && user.relations.organizationId) {
      return Areas.find({organizationId: user.relations.organizationId});
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});