Meteor.publishComposite('taskList', function (userId) {
  return {
    find: function () {
      if (userId) {
        var user = Meteor.users.findOne({_id: userId});
        var relations = user && user.relations;
        var query = getTasksQuery(relations, userId);
        return TaskList.find(query);
      } else {
        this.ready();
      }
    },
    children: [
      {
        find: function (task) {
          if (task) {
            var reference = task.reference;
            if (Object.keys(reference).length) {
              var references = {
                suppliers: Suppliers,
                menus: MenuItems,
                jobs: JobItems
              };

              var referenceCollection = references[reference.type];
              return referenceCollection.find({_id: reference.id});
            } else {
              this.ready();
            }
          } else {
            this.ready();
          }
        }
      },
      {
        find: function (task) {
          if (task) {
            return Comments.find({
              reference: task._id
            }, {
              sort: {"createdOn": -1},
              limit: 10
            });
          }
        },
        children: [
          {
            find: function (comment) {
              return Meteor.users.find({
                _id: comment.createdBy
              });
            }
          }
        ]
      }
    ]
  }
});

Meteor.publishAuthorized('todayTasks', function () {
  var user = Meteor.users.findOne({_id: this.userId});
  var area = Areas.findOne({_id: user.currentAreaId});
  var today;

  if (area) {
    today = HospoHero.dateUtils.getDateMomentForLocation(new Date(), area.locationId);
    today = moment(today).endOf('day').toDate();
  } else {
    today = moment().endOf('day').toDate();
  }

  var relations = user && user.relations;
  var sharingQuery = getTasksQuery(relations, this.userId);

  var dueDateQuery = {
    dueDate: {
      $lte: today
    },
    done: false
  };

  var query = _.extend(dueDateQuery, sharingQuery);
  return TaskList.find(query);
});

var getTasksQuery = function (relations, userId) {
  var query = {};

  if (relations && relations.organizationId) {
    var sharingOptions = {
      user: {
        sharingIds: userId
      },
      organization: {
        sharingType: 'organization',
        sharingIds: relations.organizationId
      },
      location: {
        sharingType: 'location'
      },
      area: {
        sharingType: 'area'
      }
    };

    if (relations.locationIds) {
      sharingOptions.location.sharingIds = {$in: relations.locationIds};
    }
    if (relations.areaIds) {
      sharingOptions.area.sharingIds = {$in: relations.areaIds};
    }
    query.$or = _.values(sharingOptions);
  }

  return query;
};