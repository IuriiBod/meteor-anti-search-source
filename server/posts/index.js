Meteor.methods({
  createPost: function (text, ref) {
    if (!HospoHero.isInOrganization()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to create post");
    }
    check(text, String);
    HospoHero.checkMongoId(ref);

    var doc = {
      text: text,
      createdOn: Date.now(),
      createdBy: Meteor.userId(),
      reference: ref,
      like: '',
      relations: HospoHero.getRelationsObject()
    };

    var id = Posts.insert(doc);
    logger.info("Post inserted", id);
    return id;
  },
  updatePost: function (likelist, id) {
    if (!HospoHero.isInOrganization()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to update post");
    }
    check(likelist, String);
    HospoHero.checkMongoId(id);

    Posts.update({_id: id}, {$set: {like: likelist}});
    logger.info("Post updated", id);
    return id;
  }
});