Meteor.methods({
  'createLocation': function(loc) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to create location');
    }
    if(Locations.find({organizationId: loc.organizationId, name: loc.name}).count() > 0) {
      throw new Meteor.Error("The location with the same name already exists!");
    }
    if(!OpenWeatherMap.isValid(loc.city, loc.country)){
      throw new Meteor.Error("Make sure you inserted right country and city");
    }
    // Create location
    return Locations.insert({
      name: loc.name,
      country: loc.country,
      city: loc.city,
      address: loc.address,
      pos: loc.pos,
      timezone: loc.timezone,
      openingTime: moment(loc.openingTime).toDate(),
      closingTime: moment(loc.closingTime).toDate(),
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
  },

  updateLocationMainInfo: function(locationId, doc) {
    if(!HospoHero.isManager) {
      throw new Meteor.Error(403, 'User not permitted to change location information');
    }

    HospoHero.checkMongoId(locationId);
    check(doc, Object);

    if(!OpenWeatherMap.isValid(doc.city, doc.country)){
      throw new Meteor.Error("Make sure you inserted right country and city");
    }

    return Locations.update({
      _id: locationId
    }, {
      $set: doc
    });
  },

  updatePosSettings: function(locationId, doc) {
    if(!HospoHero.isManager) {
      throw new Meteor.Error(403, 'User not permitted to change location information');
    }

    HospoHero.checkMongoId(locationId);
    check(doc, Object);

    return Locations.update({
      _id: locationId
    }, {
      $set: {
        pos: doc
      }
    });
  },

  updateShiftUpdateHour: function(newHoursValue) {
    if(!HospoHero.isManager()) {
      throw new Meteor.Error(403, 'User not permitted to change time');
    }

    return Locations.update({
      _id: HospoHero.getCurrentArea().locationId
    }, {
      $set: {
        shiftUpdateHour: newHoursValue
      }
    });
  }
});