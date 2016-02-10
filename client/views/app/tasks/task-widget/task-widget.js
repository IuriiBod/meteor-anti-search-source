Template.taskWidget.onCreated(function () {
  this.getReferenceObject = function () {
    var referenceId = HospoHero.getParamsFromRoute('_id');
    var referenceType = this.data.type;
    return {
      id: referenceId,
      type: referenceType
    };
  };

  this.isNewTaskCreating = new ReactiveVar(false);
  this.task = {
    reference: this.getReferenceObject()
  };
});


Template.taskWidget.helpers({
  tasks: function () {
    return TaskList.find({
      'reference.type': this.type,
      'reference.id': this.itemId
    }, {
      sort: {
        dueDate: 1
      }
    });
  },

  isNewTaskCreating: function () {
    return Template.instance().isNewTaskCreating.get();
  },

  task: function () {
    return Template.instance().task;
  },

  onCreateTaskAction: function () {
    var self = Template.instance();
    return function () {
      self.isNewTaskCreating.set(false);
    }
  },

  onEditTaskAction: function () {
    var self = Template.instance();
    return function (task) {
      self.task = task;
      self.isNewTaskCreating.set(true);
    }
  },

  tasksOptions() {
    return {
      namespace: this.type,
      type: 'tasks',
      name: 'Tasks',
      contentPadding: 'no-padding',
      className: 'add-task btn btn-primary btn-xs pull-left',
      url: '#',
      text: 'Add Task'
    }
  }
});

Template.taskWidget.events({
  'click .add-task': function (event, tmpl) {
    event.preventDefault();
    tmpl.task = {
      reference: tmpl.getReferenceObject()
    };
    tmpl.isNewTaskCreating.set(true);
  }
});