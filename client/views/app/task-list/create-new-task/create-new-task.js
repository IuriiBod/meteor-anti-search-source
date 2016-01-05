Template.createNewTask.onCreated(function () {
  this.displayUserSelector = new ReactiveVar(false);
  this.sharingOption = new ReactiveVar('private');
  this.sharingIds = new ReactiveVar(Meteor.userId());
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

      var sharingIds;
      switch (newValue) {
        case 'private':
          sharingIds = Meteor.userId();
          break;
        case 'area':
          sharingIds = HospoHero.getCurrentAreaId();
          break;
        case 'location':
          sharingIds = HospoHero.getCurrentArea().locationId;
          break;
        case 'organization':
          sharingIds = HospoHero.getCurrentArea().organizationId;
          break;
        default:
          sharingIds = null;
      }

      self.sharingIds.set(sharingIds);
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
      {
        name: 'new-task-title',
        newName: 'title'
      },
      {
        name: 'new-task-description',
        newName: 'description'
      }
    ]);

    var additionalTaskParams = {
      done: false,
      dueDate: tmpl.datepicker.date().toDate(),
      sharingType: tmpl.sharingOption.get(),
      sharingIds: tmpl.sharingIds.get()
    };

    newTaskInfo = _.extend(newTaskInfo, additionalTaskParams);

    Meteor.call('createTask', newTaskInfo, HospoHero.handleMethodResult(function () {
      tmpl.data.onCreateTaskAction();
    }));
  },

  'click .close-create-new-task-container': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onCreateTaskAction();
  }
});