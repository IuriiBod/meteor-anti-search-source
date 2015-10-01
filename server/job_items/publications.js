Meteor.publish('allJobItems', function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    status: 'active',
    "relations.areaId": HospoHero.currentArea(this.userId)
  };

  logger.info("All job items published");
  return JobItems.find(query, {sort: {'name': 1}});
});

Meteor.publish("jobItems", function(ids) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    "relations.areaId": HospoHero.currentArea(this.userId)
  };
  var options = {
    sort: {
      'name': 1
    }
  };

  if(ids.length > 0) {
    query._id = { $in: ids };
  } else {
    options.limit = 10;
  }

  logger.info("Job items published", ids);
  return JobItems.find(query, options);
});

Meteor.publish("jobsRelatedMenus", function(id) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  logger.info("Related menus published", {"id": id});
  return MenuItems.find({"jobItems._id": id});
});