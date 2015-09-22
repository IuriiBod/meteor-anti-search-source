Meteor.publish('allJobItems', function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = JobItems.find({"status": "active"}, {sort: {'name': 1}});
  logger.info("All job items published");
  return cursors;
});

Meteor.publish("jobItems", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  if(ids.length > 0) {
    var cursor = JobItems.find({"_id": {$in: ids}}, {sort: {'name': 1}});
    logger.info("Job items published", ids);
    return cursor;
  } 
});

Meteor.publish("jobsRelatedMenus", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  logger.info("Related menus published", {"id": id});
  return MenuItems.find({"jobItems._id": id});
});