Template.taskItem.onCreated(function () {
  this.dueDate = function () {
    var today = moment().startOf('day');
    var tomorrow = moment(today).add(1, 'day').toString();
    var dueDate = moment(this.data.dueDate).startOf('day').toString();

    if (dueDate === today.toString()) {
      return 'Today';
    } else if (dueDate === tomorrow) {
      return 'Tomorrow';
    } else {
      return HospoHero.dateUtils.dateFormat(this.data.dueDate);
    }
  };
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

  dueDate: function () {
    return Template.instance().dueDate();
  },

  dueDateClass: function () {
    var dueDate = Template.instance().dueDate();
    return dueDate === 'Today' ? 'text-danger' : dueDate === 'Tomorrow' ? 'text-warning' : '';
  }
});


Template.taskItem.events({
  'ifClicked .task-checkbox': function (event, tmpl) {
    var task = tmpl.data;
    task.done = !task.done;
    task.completedBy = task.done ? Meteor.userId() : null;
    Meteor.call('updateTask', task);
  }
});


Template.taskItem.onDestroyed(function () {
  this.$('.task-checkbox').iCheck('destroy');
});