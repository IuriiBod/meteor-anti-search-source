Template.taskItem.onCreated(function () {
  this.getDueDate = function () {
    var today = moment().startOf('day').toDate();
    var tomorrow = moment(today).add(1, 'day').toDate();
    var dueDate = moment(this.data.task.dueDate).startOf('day').toDate();

    if (dueDate < today && this.data.task.done === false) {
      return 'Overdue';
    } else {
      if (dueDate.valueOf() === today.valueOf()) {
        return 'Today';
      } else if (dueDate.valueOf() === tomorrow.valueOf()) {
        return 'Tomorrow';
      } else {
        return HospoHero.dateUtils.dateFormat(this.data.task.dueDate);
      }
    }
  };
});


Template.taskItem.onRendered(function () {
  this.$('.task-checkbox').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  var self = this;
  this.autorun(function () {
    var state = self.data.task.done ? 'check' : 'unckeck';
    self.$('.task-checbox').iCheck(state);
  });
});


Template.taskItem.helpers({
  checkboxAttr: function () {
    return this.task.done ? {checked: 'checked'} : {};
  },

  isDoneClass: function () {
    return this.task.done ? 'done' : '';
  },

  dueDateText: function () {
    return Template.instance().getDueDate();
  },

  dueDateClass: function () {
    var dueDate = Template.instance().getDueDate();
    return dueDate === 'Overdue' ? 'text-danger' : dueDate === 'Today' ? 'text-warning' : '';
  },

  isTodayTomorrowOrOverdue: function () {
    var dueDate = Template.instance().getDueDate();
    return dueDate === 'Today' || dueDate === 'Tomorrow' || dueDate === 'Overdue';
  }
});


Template.taskItem.events({
  'ifClicked .task-checkbox': function (event, tmpl) {
    var task = tmpl.data.task;
    task.done = !task.done;
    task.completedBy = task.done ? Meteor.userId() : null;
    Meteor.call('editTask', task);
  },

  'click .remove-task': function (event) {
    event.preventDefault();
    Meteor.call('removeTask', this.task);
  },

  'click .edit-task': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onEditTaskAction(tmpl.data.task);
  }
});


Template.taskItem.onDestroyed(function () {
  this.$('.task-checkbox').iCheck('destroy');
});