Meteor.publishComposite('newsfeeds', {
  find: function () {
    if (this.userId) {
      logger.info("NewsFeeds published");
      return NewsFeeds.find({
        "relations.organizationId": HospoHero.isInOrganization(this.userId)
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
          fields: {
            profile: 1,
            username: 1
          }
        });
      }
    }
  ]
});