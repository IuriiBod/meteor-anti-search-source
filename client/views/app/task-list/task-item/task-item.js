Template.taskItem.onRendered(function () {
  this.$('.task-checkbox').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});


Template.taskItem.helpers({
  checkboxAttr: function () {
    return this.task.done ? {checked: 'checked'} : {};
  },

  isDoneClass: function () {
    return this.task.done ? 'done' : '';
  },

  assignedTo: function () {
    var assignedTo = this.task.assignedTo;
    assignedTo = _.map(assignedTo, function (userId) {
      return HospoHero.username(userId);
    });
    return assignedTo.join(', ');
  },

  canDoneTask: function () {
    var userId = Meteor.userId();
    return this.task.createdBy === userId ||
      this.task.assignedTo.indexOf(userId) > -1;
  },

  taskDuration: function () {
    return HospoHero.dateUtils.minutesToHours(this.task.duration);
  },

  commentsCount: function () {
    return Comments.find({
      reference: this.task._id
    }).count();
  },

  referenceObject: function () {
    var taskReference = this.task.reference;

    if (Object.keys(taskReference).length) {
      var references = {
        suppliers: {
          collection: Suppliers,
          icon: 'fa-user',
          route: 'supplierProfile'
        },
        menus: {
          collection: MenuItems,
          icon: 'fa-cutlery',
          route: 'menuItemDetail'
        },
        jobs: {
          collection: JobItems,
          icon: 'fa-spoon',
          route: 'jobItemDetailed'
        }
      };

      var reference = references[taskReference.type];
      var referenceItem = reference.collection.findOne({_id: taskReference.id});

      return {
        icon: reference.icon,
        name: referenceItem.name,
        route: Router.url(reference.route, {_id: taskReference.id})
      };
    } else {
      return false;
    }
  }
});


Template.taskItem.events({
  'ifClicked .task-checkbox': function (event, tmpl) {
    var task = tmpl.data.task;
    task.done = !task.done;
    task.completedBy = task.done ? Meteor.userId() : null;
    Meteor.call('editTask', task);
  },

  'click .edit-task': function (event, tmpl) {
    //event.preventDefault();
    if (_.isFunction(tmpl.data.onEditTaskAction)) {
      tmpl.data.onEditTaskAction(tmpl.data.task);
    }
  }
});


Template.taskItem.onDestroyed(function () {
  this.$('.task-checkbox').iCheck('destroy');
});