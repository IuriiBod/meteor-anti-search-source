Meteor.publish('posts', function () {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  var query = {};

  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }
  
  logger.info("Posts published");
  return Posts.find(query, {sort: {"createdOn": -1}});
});