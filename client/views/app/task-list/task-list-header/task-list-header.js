Template.taskListHeader.events({
  'click .create-new-task': function (event, tmpl) {
    tmpl.data.onCreateTaskAction();
  }
});