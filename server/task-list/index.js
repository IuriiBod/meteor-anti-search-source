Meteor.methods({
  createTask: function (task) {
    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.insert(task);
  },

  updateTask: function (task) {
    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.update({_id: task._id}, {$set: task});
  },

  removeTask: function (task) {
    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.remove({_id: task._id});
  }
});