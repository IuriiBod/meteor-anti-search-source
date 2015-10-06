Meteor.publish('posts', function () {
  if(this.userId) {
    logger.info("Posts published");
    return Posts.find({
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    }, {
      sort: {
        "createdOn": -1
      }
    });
  } else {
    this.ready();
  }
});