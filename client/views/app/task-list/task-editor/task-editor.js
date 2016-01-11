Template.taskEditor.onCreated(function () {
  this.sharingType = new ReactiveVar(this.data.task.sharingType || 'private');
  this.sharingIds = new ReactiveVar(this.data.task.sharingIds || Meteor.userId());
});


Template.taskEditor.onRendered(function () {
  this.$('.new-task-title').focus();

  var dueDate = this.data.task.dueDate || new Date();
  this.$('.datepicker').datetimepicker({
    format: 'ddd DD/MM/YY',
    minDate: moment()
  });

  this.datepicker = this.$('.datepicker').data("DateTimePicker");
  this.datepicker.date(moment(dueDate));
});


Template.taskEditor.helpers({
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

  selectedOption: function () {
    return Template.instance().sharingType.get();
  },

  onSelectChange: function () {
    var self = Template.instance();
    return function (newValue) {
      self.sharingType.set(newValue);

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
    return Template.instance().sharingType.get() === 'users';
  }
});


Template.taskEditor.events({
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
    ], true);

    var reference = {};
    var $referenceSelector = tmpl.$('.reference-selector');
    if ($referenceSelector.val() !== '') {
      // get reference type (menu, job or supplier) based on parent optgroup label
      var referenceType = $referenceSelector.find('option:selected').parent().attr('label');
      referenceType = referenceType.replace(' ', '').toLowerCase();

      reference = {
        id: $referenceSelector.val(),
        type: referenceType
      };

    }

    if (newTaskInfo.title === '') {
      HospoHero.error('Task must have a title!');
    } else {
      // if we share task between users, get them ids
      if (tmpl.sharingType.get() === 'users') {
        var taggedUsers = [Meteor.userId()];
        var selectedOptions = tmpl.$('.user-selector').find('option:selected');

        selectedOptions.each(function(index, option) {
          taggedUsers.push(option.value);
        });
        tmpl.sharingIds.set(taggedUsers);
      }

      var additionalTaskParams = {
        done: false,
        dueDate: tmpl.datepicker.date().toDate(),
        sharingType: tmpl.sharingType.get(),
        sharingIds: tmpl.sharingIds.get(),
        reference: reference
      };

      newTaskInfo = _.extend(newTaskInfo, additionalTaskParams);

      var method = 'createTask';
      if (tmpl.data.task._id) {
        method = 'updateTask';
        newTaskInfo._id = tmpl.data.task._id;
      }

      Meteor.call(method, newTaskInfo, HospoHero.handleMethodResult(function () {
        tmpl.data.onCreateTaskAction();
      }));
    }
  },

  'click .close-create-new-task-container': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onCreateTaskAction();
  }
});