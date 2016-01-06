Template.taskList.onCreated(function () {
  this.isNewTaskCreating = new ReactiveVar(false);
  this.displayDoneTasks = new ReactiveVar(false);

  this.filterType = new ReactiveVar('Next 7 days');

  this.filterTypes = {
    'Next 7 days': function () {
      var today = moment().startOf('day');
      var sevenDay = moment(today).add(7, 'days');
      return TimeRangeQueryBuilder.forInterval(today, sevenDay);
    },

    'Today': function () {
      return TimeRangeQueryBuilder.forDay(moment());
    },

    'Tomorrow': function () {
      return TimeRangeQueryBuilder.forDay(moment().add(1, 'day'));
    },

    'Overdue': function () {
      return {$lte: moment().startOf('day').toDate()};
    },

    'All tasks': function () {
      return {$exists: 1};
    }
  };
});

Template.taskList.onRendered(function () {
  this.$('.tasks-switcher').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.taskList.helpers({
  onCreateTaskAction: function () {
    var self = Template.instance();
    return function () {
      self.isNewTaskCreating.set(!self.isNewTaskCreating.get());
    }
  },
  isNewTaskCreating: function () {
    return Template.instance().isNewTaskCreating.get();
  },

  tasks: function () {
    var tmpl = Template.instance();
    var filterType = tmpl.filterType.get();
    var filterTypes = tmpl.filterTypes;
    var query = {};

    if (filterTypes.hasOwnProperty(filterType)) {
      query.dueDate = filterTypes[filterType]();
    }

    query.done = tmpl.displayDoneTasks.get();

    return TaskList.find(query, {
      sort: {
        dueDate: 1
      }
    });
  },

  filterTypes: function () {
    return _.keys(Template.instance().filterTypes);
  },

  activeFilterName: function () {
    return Template.instance().filterType.get();
  },

  onFilterChange: function () {
    var self = Template.instance();
    return function (filterType) {
      self.filterType.set(filterType);
    }
  }
});


Template.taskList.events({
  'ifClicked .tasks-switcher': function (event, tmpl) {
    tmpl.displayDoneTasks.set(!tmpl.displayDoneTasks.get());
  }
});


Template.taskList.onDestroyed(function () {
  this.$('.task-switcher').iCheck('destroy');
});