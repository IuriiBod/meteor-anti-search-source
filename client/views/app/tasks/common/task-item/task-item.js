// Task references object. Contains the information about reference type, collection, icon and route
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
  },
  meetings: {
    collection: Meetings,
    icon: 'fa-users',
    route: 'meetingDetails',
    routeIdParam: 'id',
    nameField: 'title'
  },
  projects: {
    collection: Projects,
    icon: 'fa-file-o',
    route: 'projectDetails',
    routeIdParam: 'id',
    nameField: 'title'
  },
  ingredients: {
    collection: Ingredients,
    icon: 'fa-list',
    nameField: 'description'
  }
};


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

  canDoneTask: function () {
    var userId = Meteor.userId();
    return this.task.assignedTo.indexOf(userId) > -1;
  },

  canEditTask: function () {
    return this.task.createdBy === Meteor.userId();
  },

  taskDuration: function () {
    return !!this.task.duration ? HospoHero.dateUtils.humanizeTimeDuration(this.task.duration) : false;
  },

  commentsCount: function () {
    return Comments.find({
      reference: this.task._id
    }).count();
  },

  referenceObject: function () {
    var taskReference = this.task.reference;

    if (Object.keys(taskReference).length) {
      var reference = references[taskReference.type];

      if (!reference) {
        return false;
      }

      var referenceItem = reference.collection.findOne({_id: taskReference.id});

      if (!referenceItem) {
        return false;
      }

      var nameField = reference.nameField || 'name';
      let route = reference.route ? Router.url(reference.route, {[reference.routeIdParam || '_id']: taskReference.id}) : false;
      return {
        icon: reference.icon,
        name: referenceItem[nameField],
        route: route
      };
    } else {
      return false;
    }
  },

  dueDateClass: function () {
    var done = this.task.done;
    var dueDate = this.task.dueDate;
    var today = moment();
    var startOfDay = moment(today).startOf('day').toDate();
    var endOfDay = moment(today).endOf('day').toDate();

    if (dueDate < startOfDay && done === false) {
      return 'text-danger';
    } else if (dueDate >= startOfDay && dueDate <= endOfDay && done === false) {
      return 'text-info';
    } else {
      return '';
    }
  }
});


Template.taskItem.events({
  'ifClicked .task-checkbox': function (event, tmpl) {
    Meteor.call('markTaskAsDone', tmpl.data.task);
  },

  'click .edit-task': function (event, tmpl) {
    if (!$(event.target).is($('.comments-toggler'))) {
      if (_.isFunction(tmpl.data.onEditTaskAction)) {
        tmpl.data.onEditTaskAction(tmpl.data.task);
      }
    }
  }
});


Template.taskItem.onDestroyed(function () {
  this.$('.task-checkbox').iCheck('destroy');
});