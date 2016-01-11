Template.taskItem.onCreated(function () {
  this.getDueDate = function () {
    var today = moment().startOf('day').toDate();
    var tomorrow = moment(today).add(1, 'day').toDate();
    var dueDate = moment(this.data.dueDate).startOf('day').toDate();

    if (dueDate < today && this.done === false) {
      return 'Overdue';
    } else {
      if (dueDate.toString() === today.toString()) {
        return 'Today';
      } else if (dueDate.toString() === tomorrow.toString()) {
        return 'Tomorrow';
      } else {
        return HospoHero.dateUtils.dateFormat(this.data.dueDate);
      }
    }
  };
  this.dueDate = this.getDueDate();
});


Template.taskItem.onRendered(function () {
  this.$('.task-checkbox').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  var self = this;
  this.autorun(function () {
    var state = self.data.done ? 'check' : 'unckeck';
    self.$('.task-checbox').iCheck(state);
  });
});


Template.taskItem.helpers({
  checkboxAttr: function () {
    return this.done ? {checked: 'checked'} : {};
  },

  isDoneClass: function () {
    return this.done ? 'done' : '';
  },

  dueDateText: function () {
    return Template.instance().dueDate;
  },

  dueDateClass: function () {
    var dueDate = Template.instance().dueDate;
    return dueDate === 'Overdue' ? 'text-danger' : dueDate === 'Today' ? 'text-warning' : '';
  },

  isTodayTomorrowOrOverdue: function () {
    var dueDate = Template.instance().dueDate;
    return dueDate === 'Today' || dueDate === 'Tomorrow' || dueDate === 'Overdue';
  }
});


Template.taskItem.events({
  'ifClicked .task-checkbox': function (event, tmpl) {
    var task = tmpl.data;
    task.done = !task.done;
    task.completedBy = task.done ? Meteor.userId() : null;
    Meteor.call('updateTask', task);
  },

  'click .remove-task': function (event) {
    event.preventDefault();
    Meteor.call('removeTask', this);
  }
});


Template.taskItem.onDestroyed(function () {
  this.$('.task-checkbox').iCheck('destroy');
});