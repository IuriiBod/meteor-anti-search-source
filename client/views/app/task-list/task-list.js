Template.taskList.onCreated(function () {
  this.isNewTaskCreating = new ReactiveVar(false);
  this.filterType = new ReactiveVar('Next 7 days');

  this.filterTypes = {
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

    'All tasks': function () {
      return {dueDate: {$exists: 1}};
    },

    'Done tasks': function () {
      return {done: true};
    }
  };
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
    var query = {
      done: false
    };

    if (filterTypes.hasOwnProperty(filterType)) {
      _.extend(query, filterTypes[filterType]());
    }

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