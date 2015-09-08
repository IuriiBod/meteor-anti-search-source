Meteor.methods({
  'createArea': function(area) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }
    area.createdAt = Date.now();
    // Create area
    return Areas.insert(area);
  }
});