Meteor.methods({
  'createLocation': function(loc) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create location");
    }
    loc.createdAt = Date.now();
    // Create location
    return Locations.insert(loc);
  },
  'deleteLocation': function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to delete location");
    }
    Areas.remove({locationId: id});
    Locations.remove({_id: id});

    // TODO: Write the code to delete users which is related to location
  }
});