Meteor.methods({
  'addShiftUpdate': function(doc) {
    var user = Meteor.user();
    if(!user) {
      logger.error("No logged in user");
      throw new Meteor.Error(404, "No logged in user");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create shifts");
      throw new Meteor.Error(403, "User not permitted to create shifts");
    }
    var id = ShiftsUpdates.insert(doc);
    logger.info("Shift update insert");
    return id;
  }
});
