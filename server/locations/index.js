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

    //updating user in Meteor.users collection requires user id
    var usersIdsRelatedToLocation = Meteor.users
        .find({'relations.locationIds': locationId}, {fields: {_id: 1}})
        .map(function (user) { return user._id });

    Meteor.users.update({
      _id: {$in: usersIdsRelatedToLocation}
    },{
      $pull: {'relations.locationIds': locationId}
    },{
      multi: true
    });

    var areasIdsRelatedToLocation = Areas
        .find({locationId: locationId}, {fields: {_id: 1}})
        .map(function (area) { return area._id; });

    areasIdsRelatedToLocation.forEach(function (areaId) {
      Meteor.call('deleteArea', areaId);
    });

    WeatherForecast.remove({locationId: locationId});

    var googlePrediction = new GooglePredictionApi(locationId);
    googlePrediction.removePredictionModel();

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
