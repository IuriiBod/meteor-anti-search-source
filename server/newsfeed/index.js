Meteor.methods({
  'createNewsfeed': function(text, ref) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!text) {
      logger.error("Text field not found");
      throw new Meteor.Error(404, "Text field not found");
    }
    var doc = {
      "text": text,
      "createdOn": Date.now(),
      "createdBy": Meteor.userId(),
      "likes": []
    }
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
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!id) {
      logger.error("Reference field not found");
      throw new Meteor.Error(404, "Reference field not found");
    }
    var newsFeed = NewsFeeds.findOne(id);
    if(!id) {
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