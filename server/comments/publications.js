Meteor.publish('comments', function (ref) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  var query = {
    "reference": ref,
    "relations.areaId": HospoHero.currentArea(this.userId)
  };

  logger.info("Comments published", ref);
  return Comments.find(query, {
    sort: {"createdOn": -1},
    limit: 10
  });
});