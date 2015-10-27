Meteor.publish('jobItems', function(ids, status) {
  if(this.userId) {
    var query = {
      status: 'active',
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    if(ids && ids.length) {
      query._id = { $in: ids };
    }

    if(status) {
      query.status = status;
    }

    return JobItems.find(query, {sort: {'name': 1}});
  } else {
    this.ready();
  }
});

Meteor.publishComposite('jobItem', function(id) {
  return {
    find: function() {
      if(this.userId && id) {
        return JobItems.find({_id: id});
      } else {
        this.ready();
      }
    },
    children: [
      {
        find: function(jobItem) {
          if(jobItem && jobItem.ingredients && jobItem.ingredients.length) {
            var ingredients = _.map(jobItem.ingredients, function(ingredient) {
              return ingredient._id;
            });
            return Ingredients.find({ _id: { $in: ingredients } });
          } else {
            this.ready();
          }
        }
      },
      {
        find: function(jobItem) {
          if(jobItem && jobItem.section) {
            return Sections.find({ _id: jobItem.section });
          } else {
            this.ready();
          }
        }
      }
    ]
  };
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
  if(this.userId) {
    var sub = this;
    var search;

    var query = {
      'relations.areaId': HospoHero.getCurrentAreaId(this.userId)
    };

    if (selector.name) {
      search = selector.name.$regex;
      options = selector.name.$options;
    } else {
      // Match all since no selector given
      search = "";
      options = "i";
    }
    query.name = new RegExp(search, options);
    var limit = options.limit || 10;

    if(selector.type) {
      query.type = selector.type;
    }

    // Push this into our own collection on the client so they don't interfere with other publications of the named collection.
    JobItems.find(query, {
      limit: limit
    }).observeChanges({
      added: function(id, fields) {
        sub.added("autocompleteRecords", id, fields)
      }
    });
    logger.info("Autocomplete search text", selector.name);
    sub.ready();
  } else {
    this.ready();
  }
});