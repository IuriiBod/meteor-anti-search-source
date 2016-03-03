Meteor.methods({
  createTask (task) {
    if (!HospoHero.security.isUserInAnyOrganization(this.userId)) {
      logger.error('User not permitted to create tasks', {userId: this.userId});
      throw new Meteor.Error(403, 'User not permitted to create tasks', {userId: this.userId});
    }

    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.insert(task);
  },

  markTaskAsDone (task) {
    if (task.assignedTo.indexOf(this.userId) === -1) {
      logger.error('User not permitted to done/undone this task', {userId: this.userId});
      throw new Meteor.Error(403, 'User not permitted to done/undone this task', {userId: this.userId});
    }

    check(task, HospoHero.checkers.TaskListChecker);

    task = _.extend(task, {
      done: !task.done,
      completedBy: !task.done ? this.userId : null
    });

    return TaskList.update({_id: task._id}, {$set: task});
  },

  editTask (task) {
    if (task.createdBy !== this.userId) {
      logger.error('User not permitted to edit tasks', {userId: this.userId});
      throw new Meteor.Error(403, 'User not permitted to edit tasks', {userId: this.userId});
    }

    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.update({_id: task._id}, {$set: task});
  },

  removeTask (task) {
    if (task.createdBy !== this.userId) {
      logger.error('User not permitted to remove tasks', {userId: this.userId});
      throw new Meteor.Error(403, 'User not permitted to remove tasks', {userId: this.userId});
    }

    check(task, HospoHero.checkers.TaskListChecker);
    return TaskList.remove({_id: task._id});
  }
});