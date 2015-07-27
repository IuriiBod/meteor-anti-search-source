Meteor.publish("allSections", function() {
  logger.info("Sections published");
  return Sections.find();

});

Meteor.publish("section", function(id) {
  logger.info("Sections published");
  return Sections.find({"_id": id});
});

Meteor.publish("allCategories", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  logger.info("Categories published");
  return Categories.find();
});

Meteor.publish("allStatuses", function() {
  logger.info("Statuses published");
  return Statuses.find();
});

Meteor.publish("allAreas", function() {
  var cursors = [];
  cursors.push(GeneralAreas.find())
  cursors.push(SpecialAreas.find());
  logger.info("All areas published");
  return cursors;
});