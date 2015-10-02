Meteor.methods({
  createPost: function (text, ref, options) {
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

    options.commentId = id;
    Meteor.call("sendNotifications", ref, "comment", options, function (err) {
      if (err) {
        HospoHero.alert(err);
      }
    });

    return id;
  },
  updatePost: function (likelist, id, options) {
    if (!HospoHero.isInOrganization()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to update post");
    }
    check(likelist, String);
    HospoHero.checkMongoId(id);

    Posts.update({_id: id}, {$set: {like: likelist}});
    logger.info("Post updated", id);

    options.commentId = id;
    Meteor.call("sendNotifications", ref, "post", options, function (err) {
      if (err) {
        HospoHero.alert(err);
      }
    });
    return id;
  }
});