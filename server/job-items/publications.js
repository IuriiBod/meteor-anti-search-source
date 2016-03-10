Meteor.publish('jobItems', function (ids, areaId, status) {
  if (this.userId) {
    var query = {
      'relations.areaId': areaId
    };

    if (ids && ids.length) {
      query._id = {$in: ids};
    }

    //if status isn't defined when function called status = {}
    if (status && !_.isEmpty(status)) {
      query.status = status;
    }

    return JobItems.find(query, {sort: {'name': 1}});
  } else {
    this.ready();
  }
});

Meteor.publishComposite('jobItem', function (id) {
  return {
    find: function () {
      if (this.userId && id) {
        return JobItems.find({_id: id});
      } else {
        this.ready();
      }
    },
    children: [
      {
        find: function (jobItem) {
          if (jobItem && jobItem.ingredients && jobItem.ingredients.length) {
            var ingredients = _.map(jobItem.ingredients, function (ingredient) {
              return ingredient._id;
            });
            return Ingredients.find({_id: {$in: ingredients}});
          } else {
            this.ready();
          }
        }
      },
      {
        find: function (jobItem) {
          if (jobItem && jobItem.section) {
            return Sections.find({_id: jobItem.section});
          } else {
            this.ready();
          }
        }
      },
      {
        find: function (jobItem) {
          if (jobItem && jobItem._id) {
            return TaskList.find({'reference.id': jobItem._id});
          } else {
            this.ready();
          }
        }
      },
      {
        find: function (jobItem) {
          if (jobItem && jobItem.type) {
            return JobTypes.find({_id: jobItem.type});
          } else {
            this.ready();
          }
        }
      },
      {
        find: function (jobItem) {
          if (jobItem && jobItem._id) {
            return MenuItems.find({'jobItems._id': jobItem._id});
          } else {
            this.ready();
          }
        },
        children:[
          {
            find: function (menuItem) {
              if (menuItem && menuItem.category) {
                return Categories.find({_id:menuItem.category});
              } else {
                this.ready();
              }
            }
          }
        ]
      }
    ]
  };
});
