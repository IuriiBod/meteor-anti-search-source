let filterTypes = {
  'All tasks': function () {
    return {};
  },

  'Next 7 days': function () {
    let today = moment().startOf('day');
    let sevenDay = moment(today).add(7, 'days');
    return {dueDate: TimeRangeQueryBuilder.forInterval(today, sevenDay)};
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
    let tmpl = Template.instance();
    return function () {
      tmpl.task = {};
      tmpl.isNewTaskCreating.set(!tmpl.isNewTaskCreating.get());
    };
  },

  onEditTaskAction: function () {
    let tmpl = Template.instance();
    return function (task) {
      tmpl.task = task;
      tmpl.isNewTaskCreating.set(true);
    };
  },

  isNewTaskCreating: function () {
    return Template.instance().isNewTaskCreating.get();
  },

  tasks: function () {
    let tmpl = Template.instance();
    let filterType = tmpl.filterType.get();
    let filterUser = tmpl.filterUser.get();

    let query = HospoHero.misc.getTasksQuery(Meteor.userId(), filterUser);
    query.done = false;

    if (filterTypes.hasOwnProperty(filterType)) {
      let filterQuery = filterTypes[filterType]();

      if (filterQuery) {
        _.extend(query, filterQuery);
      }
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
    let tmpl = Template.instance();
    return function (filterType) {
      tmpl.filterType.set(filterType);
    };
  },

  onUserFilterChange: function () {
    let tmpl = Template.instance();
    return function (user) {
      tmpl.filterUser.set(user);
    };
  }
});