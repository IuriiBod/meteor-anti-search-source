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
  var cursors = [];
  var jobsItems = null;
  if(ids.length > 0) {
    jobsItems = JobItems.find({"_id": {$in: ids}}, {sort: {'name': 1}});
  } else {
    jobsItems = JobItems.find({}, {sort: {'name': 1}, limit: 10});
  }
  cursors.push(jobsItems);
  logger.info("Job items published", {"ids": ids});
  return cursors;
});

Meteor.publish("jobsRelatedMenus", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  logger.info("Related menus published", {"id": id});
  return MenuItems.find({"jobItems._id": id});
});

Meteor.publish("autocomplete-jobItems", function(selector, options) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }

  sub = this
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
  handle = JobItems.find({"name": regex}, {"limit": limit}).observeChanges({
    added: function(id, fields) {
      sub.added("autocompleteRecords", id, fields)
    }
  })
  logger.info("Autocomplete search text", selector.name);
  sub.ready();
});

