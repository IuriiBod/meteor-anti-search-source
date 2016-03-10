Template.organizationStructure.helpers({
  organizations: function () {
    return Organizations.find();
  },

  locations: function () {
    return Locations.find({organizationId: this._id, archived: {$ne: true}});
  }
});