Meteor.methods({
  'addShiftUpdate': function(doc) {
    if(!HospoHero.perms.canUser('editRoster')()) {
      logger.error(403, "User not permitted to create shifts");
    }

    var id = ShiftsUpdates.insert(doc);
    logger.info("Shift update insert");
    return id;
  }
});
