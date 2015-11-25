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
      throw new Meteor.Error(403, 'User not permitted to delete location');
    }

    Locations.remove({_id: locationId});
    Areas.remove({locationId: locationId});
    WeatherForecast.remove({locationId: locationId});
    DailySales.remove({'relations.locationId': locationId});//SalesPrediction

    var googlePrediction = new GooglePredictionApi(locationId);
    googlePrediction.removePredictionModel();

    logger.info('Location was deleted', {locationId: locationId});
  },

  editLocation: function (updatedLocation) {
    check(updatedLocation, HospoHero.checkers.LocationDocument);

    var userId = Meteor.userId();
    if (!HospoHero.canUser('edit locations', userId)) {
      throw new Meteor.Error(403, 'User not permitted to edit locations');
    }

    Locations.update({_id: updatedLocation._id}, {$set: updatedLocation});
    logger.info('Location was updated', {locationId: updatedLocation._id});
  }
});