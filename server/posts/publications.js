Meteor.publish('posts', function () {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  
  logger.info("Posts published");
  return Posts.find({ "relations.areaId": HospoHero.getCurrentAreaId(this.userId) }, {sort: {"createdOn": -1}});
});