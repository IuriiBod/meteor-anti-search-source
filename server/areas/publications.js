Meteor.publish('areasOfOrganization', function () {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    if (user && user.relations && user.relations.organizationIds) {
      return Areas.find({organizationId: HospoHero.isInOrganization(user._id)});
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});