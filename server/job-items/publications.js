Meteor.publish('jobItemsInArea', function (areaId, status) {
  check(areaId, HospoHero.checkers.MongoId);
  check(status, Match.OneOf(HospoHero.checkers.JobItemStatus, null));

  let permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  if (permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'view jobs')) {

    var query = {
      'relations.areaId': areaId
    };

    //if status isn't defined when function called status = {}
    if (status && !_.isEmpty(status)) {
      query.status = status;
    }
    return JobItems.find(query, {sort: {'name': 1}});

  } else {
    logger.error('Permission denied: publish [jobItemsInArea] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});


Meteor.publishComposite('jobItem', function (jobItemId) {
  check(jobItemId, HospoHero.checkers.MongoId);

  const permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);

  const jobItem = JobItems.findOne({_id: jobItemId});
  const areaId = jobItem && HospoHero.utils.getNestedProperty(jobItem, 'relations.areaId', false);
  const hasPermission = areaId && permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'view jobs');

  if (!hasPermission) {
    logger.error('Permission denied: publish [jobItem] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
    return;
  }

  return {
    find: function () {
      return JobItems.find({_id: jobItemId});
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
        children: [
          {
            find: function (menuItem) {
              if (menuItem && menuItem.category) {
                return Categories.find({_id: menuItem.category});
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
