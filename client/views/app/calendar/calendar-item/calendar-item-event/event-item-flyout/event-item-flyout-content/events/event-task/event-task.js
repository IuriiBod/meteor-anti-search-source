// context event: CalendarEvent Object

Template.eventTask.onCreated(function () {
  this.task = () => {
    let taskId = this.data.event.itemId;
    return TaskList.findOne({_id: taskId});
  };
});

Template.eventTask.helpers({
  task: function () {
    return Template.instance().task();
  },

  taskDuration: function () {
    var duration = Template.instance().task().duration;
    return duration > 0 ? HospoHero.dateUtils.humanizeTimeDuration(duration, 'minutes') : 'an hour';
  }
});

Template.eventTask.events({
  'click .done-task': function (event, tmpl) {
    var task = tmpl.task();
    task = _.extend(task, {
      done: !task.done,
      completedBy: !task.done ? Meteor.userId() : null
    });
    Meteor.call('editTask', task);
  }
});