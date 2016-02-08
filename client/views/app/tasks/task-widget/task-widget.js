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

  collapsed() {
    return this.uiStates.getUIState('tasks');
  }
});

Template.taskWidget.events({
  'click .create-task': function (event, tmpl) {
    event.preventDefault();
    tmpl.task = {
      reference: tmpl.getReferenceObject()
    };
    tmpl.isNewTaskCreating.set(true);
  },

  'shown.bs.collapse #Tasks': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('tasks', true);
  }, 1000),

  'hidden.bs.collapse #Tasks': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('tasks', false);
  }, 1000)
});