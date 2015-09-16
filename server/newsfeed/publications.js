Meteor.publish('newsfeeds', function() {
    var userId = this.userId;
    if(!userId) {
      logger.error('User not found : ' + this.userId);
      this.error(new Meteor.Error(404, "User not found"));
    }
    var cursor = [];
    cursor.push(NewsFeeds.find({}, {sort: {"createdOn": -1}}));
    logger.info("NewsFeeds published");
    return cursor;
});