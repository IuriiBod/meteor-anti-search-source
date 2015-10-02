Meteor.methods({
  'createComment': function(text, ref) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!text) {
      logger.error("Text field not found");
      throw new Meteor.Error(404, "Text field not found");
    }
    if(!ref) {
      logger.error("Reference field not found");
      throw new Meteor.Error(404, "Reference field not found");
    }
    var doc = {
      text: text,
      createdOn: Date.now(),
      createdBy: Meteor.userId(),
      reference: ref,
      relations: HospoHero.getRelationsObject()
    };
    var id = Comments.insert(doc);
    logger.info("Comment inserted", id);
    return id;
  }
});