Template.createNewTask.onCreated(function () {
  this.displayUserSelector = new ReactiveVar(false);
  this.sharingOption = new ReactiveVar('private');
});


Template.createNewTask.onRendered(function () {
  this.$('.new-task-title').focus();

  this.$('.datepicker').datetimepicker({
    format: 'ddd DD/MM/YY',
    minDate: moment(),
    defaultDate: moment()
  });

  this.datepicker = this.$('.datepicker').data("DateTimePicker");
});


Template.createNewTask.helpers({
  taskSharingOptions: function () {
    return [
      {
        value: 'private',
        text: 'Private'
      },
      {
        value: 'users',
        text: 'For users'
      },
      {
        value: 'area',
        text: 'For current area'
      },
      {
        value: 'location',
        text: 'For current location'
      },
      {
        value: 'organization',
        text: 'For current organization'
      }
    ];
  },

  onSelectChange: function () {
    var self = Template.instance();
    return function (newValue) {
      self.sharingOption.set(newValue);
      self.displayUserSelector.set(newValue === 'users');
    }
  },

  displayUserSelector: function () {
    return Template.instance().displayUserSelector.get();
  }
});


Template.createNewTask.events({
  'click .open-datetimepicker': function (event, tmpl) {
    tmpl.datepicker.show();
  },

  'submit form': function (event, tmpl) {
    event.preventDefault();
    var newTaskInfo = HospoHero.misc.getValuesFromEvent(event, [
      'new-task-title',
      'new-task-description'
    ]);

    newTaskInfo.date = tmpl.datepicker.date().toDate();

    console.log('NEW', newTaskInfo);
  },

  'click .close-create-new-task-container': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onCreateTaskAction();
  }
});