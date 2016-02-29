Meteor.methods({
  createTask: function (task) {
    if (!HospoHero.security.isUserInAnyOrganization(this.userId)) {
      logger.error('User not permitted to create tasks', {userId: Meteor.userId()});
      throw new Meteor.Error(403, 'User not permitted to create tasks', {userId: Meteor.userId()});
    }

    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.insert(task);
  },

  editTask: function (task) {
    if (!HospoHero.security.isUserInAnyOrganization(this.userId)) {
      logger.error('User not permitted to edit tasks', {userId: Meteor.userId()});
      throw new Meteor.Error(403, 'User not permitted to edit tasks', {userId: Meteor.userId()});
    }

    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.update({_id: task._id}, {$set: task});
  },

  removeTask: function (task) {
    if (!HospoHero.security.isUserInAnyOrganization(this.userId)) {
      logger.error('User not permitted to remove tasks', {userId: Meteor.userId()});
      throw new Meteor.Error(403, 'User not permitted to remove tasks', {userId: Meteor.userId()});
    }

    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.remove({_id: task._id});
  }
});