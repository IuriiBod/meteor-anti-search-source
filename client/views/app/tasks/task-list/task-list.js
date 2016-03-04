var filterTypes = {
  'All tasks': function () {
    return {dueDate: {$exists: 1}};
  },

  'Next 7 days': function () {
    var today = moment().startOf('day');
    var sevenDay = moment(today).add(7, 'days');
    return {
      $or: [
        {dueDate: TimeRangeQueryBuilder.forInterval(today, sevenDay)},
        {dueDate: {$lte: moment().startOf('day').toDate()}}
      ]
    };
  },

  'Today': function () {
    return {dueDate: TimeRangeQueryBuilder.forDay(moment())};
  },

  'Tomorrow': function () {
    return {dueDate: TimeRangeQueryBuilder.forDay(moment().add(1, 'day'))};
  },

  'Overdue': function () {
    return {dueDate: {$lte: moment().startOf('day').toDate()}};
  },

  'Done tasks': function () {
    return {done: true};
  }
};


Template.taskList.onCreated(function () {
  this.isNewTaskCreating = new ReactiveVar(false);
  this.filterType = new ReactiveVar('All tasks');
  this.filterUser = new ReactiveVar(Meteor.userId());
  this.task = {};
});


Template.taskList.helpers({
  onCreateTaskAction: function () {
    var self = Template.instance();
    return function () {
      self.task = {};
      self.isNewTaskCreating.set(!self.isNewTaskCreating.get());
    };
  },

  onEditTaskAction: function () {
    var self = Template.instance();
    return function (task) {
      self.task = task;
      self.isNewTaskCreating.set(true);
    };
  },

  isNewTaskCreating: function () {
    return Template.instance().isNewTaskCreating.get();
  },

  tasks: function () {
    var tmpl = Template.instance();
    var filterType = tmpl.filterType.get();
    var filterUser = tmpl.filterUser.get();

    var query = HospoHero.misc.getTasksQuery(filterUser);
    query.done = false;
    if (filterUser) {
      query.assignedTo = filterUser;
    }

    if (filterTypes.hasOwnProperty(filterType)) {
      _.extend(query, filterTypes[filterType]());
    }

    return TaskList.find(query, {
      sort: {
        dueDate: 1
      }
    });
  },

  task: function () {
    return Template.instance().task;
  },

  filterTypes: function () {
    return _.keys(filterTypes);
  },

  activeFilterName: function () {
    return Template.instance().filterType.get();
  },

  onDateFilterChange: function () {
    var self = Template.instance();
    return function (filterType) {
      self.filterType.set(filterType);
    };
  },

  onUserFilterChange: function () {
    var self = Template.instance();
    return function (user) {
      self.filterUser.set(user);
    };
  }
});