Meteor.methods({
  //todo: get rid of this method
  'addShiftUpdate': function (doc) {
    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error(403, "User not permitted to add shift update");
    }
    doc.locationId = HospoHero.getCurrentArea().locationId;

    logger.info("Shift update insert");
    return ShiftsUpdates.insert(doc);
  }
});
