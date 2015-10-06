Meteor.publish('allJobItems', function() {
  if(this.userId) {
    var query = {
      status: 'active',
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    logger.info("All job items published");
    return JobItems.find(query, {sort: {'name': 1}});
  } else {
    this.ready();
  }
});

Meteor.publish("jobItems", function(ids) {
  if(this.userId) {
    var query = {
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };
    var options = {
      sort: {
        'name': 1
      }
    };

    if (ids.length > 0) {
      query._id = {$in: ids};
    } else {
      options.limit = 10;
    }

    logger.info("Job items published", ids);
    return JobItems.find(query, options);
  } else {
    this.ready();
  }
});

Meteor.publish("jobsRelatedMenus", function(id) {
  if(this.userId) {
    logger.info("Related menus published", {"id": id});
    return MenuItems.find({"jobItems._id": id});
  } else {
    this.ready();
  }
});