Meteor.publish('newsfeeds', function () {
  if (this.userId) {
    logger.info("NewsFeeds published");
    return NewsFeeds.find({
      "relations.organizationId": HospoHero.isInOrganization(this.userId)
    }, {
      sort: { "createdOn": -1 }
    });
  } else {
    this.ready();
  }
});