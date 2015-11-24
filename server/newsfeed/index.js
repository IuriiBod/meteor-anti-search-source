Meteor.methods({
  createNewsfeed: function (text, ref, recipients) {
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

    if (ref) {
      var feed = NewsFeeds.findOne({_id: ref});
      if (feed.createdBy != Meteor.userId()) {
        new NotificationSender(
          'New comment',
          'new-newsfeed-comment',
          {
            username: HospoHero.username(Meteor.userId())
          }
        ).sendNotification(feed.createdBy);
      }
    }
    if (recipients.length) {
      var notificationSender = new NotificationSender(
        'Mention in a newsfeed',
        'mention-in-a-newsfeed',
        {
          username: HospoHero.username(Meteor.userId())
        }
      );
      recipients.forEach(function (recipientName) {
        var user = Meteor.users.findOne({username: recipientName});
        notificationSender.sendNotification(user._id);
      });
    }
    return id;
  },

  updateNewsfeed: function (id, userId) {
    if (!HospoHero.isInOrganization()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to update post");
    }
    check(id, HospoHero.checkers.MongoId);
    check(userId, HospoHero.checkers.MongoId);

    var newsFeed = NewsFeeds.findOne(id);
    if (!newsFeed) {
      logger.error("NewsFeed item not found");
      throw new Meteor.Error(404, "NewsFeed item not found");
    }
    if (newsFeed.likes.indexOf(userId) >= 0) {
      NewsFeeds.update({_id: id}, {$pull: {likes: userId}});
    } else {
      NewsFeeds.update({_id: id}, {$addToSet: {likes: userId}});
    }
    logger.info("NewsFeed updated", id);
    return id;
  }
});