Meteor.methods({
  createTask: function (task) {
    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.insert(task);
  }
});