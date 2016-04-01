let commentsPublisher = {
  // publish comments to the task
  find: function (task) {
    if (task) {
      return Comments.find({
        reference: task._id
      });
    }
  },
  children: [
    {
      find: function (comment) {
        return Meteor.users.find({
          _id: comment.createdBy
        }, {
          fields: HospoHero.security.getPublishFieldsFor('users')
        });
      }
    }
  ]
};

let getTaskReferenceCollection = (taskReference) => {
  var references = {
    suppliers: Suppliers,
    menus: MenuItems,
    jobs: JobItems,
    meetings: Meetings,
    managerNotes: ManagerNotes,
    project: Projects,
    interviews: Interviews
  };

  return references[taskReference.type];
};


Meteor.publishComposite('taskList', function (userId) {
  return {
    // publish all user's tasks
    find: function () {
      var query = {};

      return TaskList.find(query);
    },
    children: [
      {
        // publish reference of the task
        find: function (task) {
          if (task && task.reference && _.keys(task.reference).length) {
            let reference = task.reference;
            let referenceCollection = getTaskReferenceCollection(reference);

            return referenceCollection.find({_id: reference.id});
          } else {
            this.ready();
          }
        }
      },
      // publish task's assigned users
      {
        find: function (task) {
          return Meteor.users.find({
            _id: {
              $in: task.assignedTo
            }
          }, {
            fields: HospoHero.security.getPublishFieldsFor('users')
          });
        }
      },
      commentsPublisher
    ]
  };
});

Meteor.publish('todayTasks', function () {
  if (this.userId) {
    var user = Meteor.users.findOne({_id: this.userId});
    var area = Areas.findOne({_id: user.currentAreaId});
    var today;

    if (area) {
      today = HospoHero.dateUtils.getDateMomentForLocation(new Date(), area.locationId);
      today = moment(today).endOf('day').toDate();
    } else {
      today = moment().endOf('day').toDate();
    }

    var sharingQuery = HospoHero.misc.getTasksQuery(this.userId);
    var dueDateQuery = {
      dueDate: {
        $lte: today
      },
      done: false
    };

    var query = _.extend(dueDateQuery, sharingQuery);
    return TaskList.find(query);
  } else {
    this.ready();
  }
});

Meteor.publishComposite('specifiedTasks', function (referenceType, referenceId) {
  check(referenceType, String);
  check(referenceId, HospoHero.checkers.MongoId);

  return {
    find () {
      // we don't ask any permissions, because we WANT to publish those tasks
      return TaskList.find({
        'reference.id': referenceId,
        'reference.type': referenceType
      });
    },

    children: [commentsPublisher]
  };
});