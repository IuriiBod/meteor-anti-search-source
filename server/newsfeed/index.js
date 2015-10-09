Meteor.methods({
  'createNewsfeed': function(text, ref) {
    if (!HospoHero.isInOrganization()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to create post");
    }

    var doc = {
      "text": text,
      "createdOn": Date.now(),
      "createdBy": Meteor.userId(),
      "likes": [],
      relations: HospoHero.getRelationsObject()
    };
    if(ref) {
      doc["reference"] = ref;
    } else {
      doc['reference'] = null;
    }
    var id = NewsFeeds.insert(doc);
    logger.info("NewsFeed text inserted", id);
    return id;
  },

  'updateNewsfeed': function(id, userId) {
    if (!HospoHero.isInOrganization()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to update post");
    }
    HospoHero.checkMongoId(id);
    HospoHero.checkMongoId(userId);

    var newsFeed = NewsFeeds.findOne(id);
    if(!newsFeed) {
      logger.error("NewsFeed item not found");
      throw new Meteor.Error(404, "NewsFeed item not found");
    }
    if(newsFeed.likes.indexOf(userId) >= 0) {
      logger.error("You've already liked this", id);
      throw new Meteor.Error(404, "You've already liked this");
    }

    NewsFeeds.update({_id: id}, {$addToSet: {"likes": userId}});
    logger.info("NewsFeed updated", id);
    return id;
  }
});