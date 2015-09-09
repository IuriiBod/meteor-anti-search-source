Template.organizationStructure.events({
  'click .location-settings': function() {
    Session.set('locationId', this._id);
  }
});