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
  logger.info("Related menus published", {"id": id});
  return MenuItems.find({"jobItems._id": id});
});

Meteor.publish("autocomplete-jobItems", function(selector, options) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }

  var sub = this;
  var search;

  if (selector.name) {
    search = selector.name.$regex;
    options = selector.name.$options;
  } else {
    // Match all since no selector given
    search = "";
    options = "i";
  }
   var regex = new RegExp(search, options);
   var limit = options.limit || 10;

  // Push this into our own collection on the client so they don't interfere with other publications of the named collection.
  JobItems.find({"name": regex}, {"limit": limit}).observeChanges({
    added: function(id, fields) {
      sub.added("autocompleteRecords", id, fields)
    }
  });
  logger.info("Autocomplete search text", selector.name);
  sub.ready();
});