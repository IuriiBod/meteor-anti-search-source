Template.taskList.onCreated(function () {
  this.isNewTaskCreating = new ReactiveVar(false);
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
    return TaskList.find({}, {
      sort: {
        date: 1
      }
    });
  }
});