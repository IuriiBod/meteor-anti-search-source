Meteor.methods({
  createLocation: function (location) {
    var defaultLocation = {
      address: '',
      pos: null,
      createdAt: Date.now()
    };

    _.defaults(location, defaultLocation);

    check(location, HospoHero.checkers.LocationDocument);

    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to create location');
    }
    // Create location
    var id = Locations.insert(location);
    logger.info('Location was created', {locationId: id});
  },

  deleteLocation: function (locationId) {
    if (!HospoHero.isOrganizationOwner()) {
      logger.error("User not permitted to delete this location");
      throw new Meteor.Error(403, "User not permitted to delete this location");
    }

    check(locationId, HospoHero.checkers.MongoId);

    //remove location's members
    //updating user in Meteor.users collection requires user id
    let locationMembersIds = Meteor.users.find({'relations.locationIds': locationId}, {
      fields: {_id: 1}
    }).map(user => user._id);

    Meteor.users.update({
      _id: {$in: locationMembersIds}
    }, {
      $pull: {'relations.locationIds': locationId}
    }, {
      multi: true
    });

    Areas.find({locationId: locationId}, {
      fields: {_id: 1}
    }).forEach(area => {
      Meteor.call('deleteArea', area._id);
    });

    WeatherForecast.remove({locationId: locationId});

    Locations.remove({_id: locationId});
    logger.info('Location was deleted', {locationId: locationId});
  },

  editLocation: function (updatedLocation) {
    check(updatedLocation, HospoHero.checkers.LocationDocument);

    var userId = Meteor.userId();
    if (!HospoHero.canUser('edit locations', userId)) {
      throw new Meteor.Error(403, 'User not permitted to edit locations');
    }

    Locations.update({_id: updatedLocation._id}, {$set: updatedLocation});
    logger.info('Location was updated', {locationId: updatedLocation._id, userId: Meteor.userId()});
  }
});
