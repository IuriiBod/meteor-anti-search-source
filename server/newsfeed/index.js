Meteor.methods({
  createNewsfeed: function(text, ref, recipients) {
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
    doc["reference"] = ref ? ref : null;

    var id = NewsFeeds.insert(doc);
    logger.info("NewsFeed text inserted", id);

    var options;
    if(ref) {
      var feed = NewsFeeds.findOne({ _id: ref });
      if(feed.createdBy != Meteor.userId()) {
        options = {
          title: "There is a new comment to your newsfeed post",
          to: feed.createdBy,
          ref: ref,
          type: 'newsfeed',
          relations: doc.relations
        };
        HospoHero.sendNotification(options);
      }
    }
    if(recipients.length) {
      recipients = _.map(recipients, function(recipientName) {
        var user = Meteor.users.findOne({username: recipientName});
        return user ? user._id : null;
      });
    }

    options = {
      title: "You've been mentioned in the newsfeed",
      to: recipients,
      ref: id,
      type: 'newsfeed',
      relations: doc.relations
    };
    HospoHero.sendNotification(options);

    return id;
  },

  updateNewsfeed: function(id, userId) {
    if (!HospoHero.isInOrganization()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to update post");
    }
    check(id, HospoHero.checkers.MongoId);
    check(userId, HospoHero.checkers.MongoId);

    var newsFeed = NewsFeeds.findOne(id);
    if(!newsFeed) {
      logger.error("NewsFeed item not found");
      throw new Meteor.Error(404, "NewsFeed item not found");
    }
    if(newsFeed.likes.indexOf(userId) >= 0) {
      NewsFeeds.update({_id: id}, {$pull: {likes: userId}});
    } else {
      NewsFeeds.update({_id: id}, {$addToSet: {likes: userId}});
    }
    logger.info("NewsFeed updated", id);
    return id;
  }
});