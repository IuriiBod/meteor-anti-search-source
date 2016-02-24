Meteor.publishComposite('newsfeeds', {
  find: function () {
    if (this.userId) {
      logger.info("NewsFeeds published");
      let currentArea = HospoHero.getCurrentArea(this.userId);
      return NewsFeeds.find({
        "relations.organizationId": currentArea.organizationId
      }, {
        sort: {"createdOn": -1}
      });
    } else {
      this.ready();
    }
  },
  children: [
    {
      find: function (newsfeed) {
        return Meteor.users.find({
          _id: newsfeed.createdBy
        }, {
          fields: HospoHero.security.getPublishFieldsFor('users')
        });
      }
    }
  ]
});