Meteor.methods({
  createNewsfeed: function (text, ref, recipients) {
    if (!HospoHero.getCurrentAreaId(this.userId)) {
      logger.error('No user has logged in');
      throw new Meteor.Error(403, "User not permitted to create post");
    }

    var doc = {
      text: text,
      createdOn: Date.now(),
      createdBy: Meteor.userId(),
      likes: [],
      relations: HospoHero.getRelationsObject()
    };
    doc.reference = ref ? ref : null;

    var id = NewsFeeds.insert(doc);
    logger.info("NewsFeed text inserted", id);

    let notificationSenderOptions = {
      helpers: {
        linkToItem: function () {
          return NotificationSender.urlFor('dashboard', {}, this);
        }
      }
    };

    if (ref) {
      var feed = NewsFeeds.findOne({_id: ref});
      if (feed.createdBy !== this.userId) {
        new NotificationSender(
          'New comment',
          'new-newsfeed-comment',
          {
            username: HospoHero.username(this.userId)
          },
          notificationSenderOptions
        ).sendNotification(feed.createdBy);
      }
    }
    if (recipients.length) {
      var notificationSender = new NotificationSender(
        'Mention in a newsfeed',
        'mention-in-a-newsfeed',
        {
          username: HospoHero.username(this.userId)
        },
        notificationSenderOptions
      );
      recipients.forEach(function (recipient) {
        notificationSender.sendNotification(recipient._id);
      });
    }
    return id;
  },

  updateNewsfeed: function (id, userId) {
    if (!HospoHero.getCurrentAreaId(this.userId)) {
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