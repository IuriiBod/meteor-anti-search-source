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
  tasks() {
    return TaskList.find({
      'reference.type': this.type,
      'reference.id': this.itemId
    }, {
      sort: {
        dueDate: 1
      }
    });
  },

  isNewTaskCreating() {
    return Template.instance().isNewTaskCreating.get();
  },

  task() {
    return Template.instance().task;
  },

  onCreateTaskAction() {
    var self = Template.instance();
    return function () {
      self.isNewTaskCreating.set(false);
    }
  },

  onEditTaskAction() {
    var self = Template.instance();
    return function (task) {
      self.task = task;
      self.isNewTaskCreating.set(true);
    }
  },

  tasksSettings() {
    let buttons = [];
    if (HospoHero.canUser(`edit menus`, Meteor.userId())) {
      let addTask = {
        className: 'add-task btn btn-primary btn-xs pull-left',
        url: '#',
        text: 'Add Task'
      };
      buttons.push(addTask);
    }
    return {
      namespace: this.type,
      uiStateId: 'task',
      title: 'Tasks',
      buttons: buttons
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