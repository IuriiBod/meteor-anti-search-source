Meteor.publish('locationsOfOrganization', function () {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    if (user && user.relations && user.relations.organizationIds) {
      return Locations.find({organizationId: HospoHero.isInOrganization(user._id)});
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});