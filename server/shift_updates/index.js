Meteor.methods({
  'addShiftUpdate': function(doc) {
    if(!HospoHero.perms.canUser('editRoster')()) {
      logger.error(403, "User not permitted to add shift update");
    }
    doc.locationId = HospoHero.getCurrentArea().locationId;

    logger.info("Shift update insert");
    return ShiftsUpdates.insert(doc);
  }
});
