Meteor.methods({
  'createLocation': function(loc) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to create location');
    }
    if(Locations.find({organizationId: loc.organizationId, name: loc.name}).count() > 0) {
      throw new Meteor.Error("The location with the same name already exists!");
    }
    // Create location
    return Locations.insert({
      name: loc.name,
      address: loc.address,
      timezone: loc.timezone,
      openingTime: loc.openingTime,
      closingTime: loc.closingTime,
      status: loc.status,
      organizationId: loc.organizationId,
      createdAt: Date.now()
    });
  },
  'deleteLocation': function(id) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to delete location');
    }
    Areas.remove({locationId: id});
    Locations.remove({_id: id});

    // TODO: Write the code to delete users which is related to location
  },

  'updateLocationName': function(id, val) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to update location');
    }
    var location = Locations.findOne({_id: id});
    if(Locations.find({organizationId: location.organizationId, name: val}).count() > 0) {
      throw new Meteor.Error("The location with the same name already exists!");
    }
    Locations.update({_id: id}, {$set: {name: val}});
  }
});