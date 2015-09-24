Meteor.publish('comments', function (ref) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  var query = {
    "reference": ref
  };

  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }
  logger.info("Comments published", ref);
  return Comments.find(query, {
    sort: {"createdOn": -1},
    limit: 10
  });
});