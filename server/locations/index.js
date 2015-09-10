Meteor.methods({
  'createLocation': function(loc) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to create locations");
      throw new Meteor.Error(403, "User not permitted to create locations");
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
      logger.error("User not permitted to delete locations");
      throw new Meteor.Error(403, "User not permitted to delete locations");
    }
    Areas.remove({locationId: id});
    Locations.remove({_id: id});

    // TODO: Write the code to delete users which is related to location
  },

  'updateLocationName': function(id, val) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to edit location name");
      throw new Meteor.Error(403, "User not permitted to edit location name");
    }
    Locations.update({_id: id}, {$set: {name: val}});
  }
});