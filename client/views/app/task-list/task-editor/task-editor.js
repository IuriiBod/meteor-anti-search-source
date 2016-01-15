Template.taskEditor.onCreated(function () {
  this.sharingType = new ReactiveVar(this.data.task.sharingType || 'private');
  this.sharingIds = new ReactiveVar(this.data.task.sharingIds || Meteor.userId());

  var dueDate = this.data.task.dueDate || new Date();
  this.dueDate = new ReactiveVar(dueDate);
});


Template.taskEditor.onRendered(function () {
  this.$('.new-task-title').focus();

  this.datepicker  = this.$('.date-picker-input');
  this.datepicker .datepicker({
    format: 'D dd/mm/yy',
    startDate: new Date()
  });

  this.datepicker.datepicker('setDate', this.dueDate.get());
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
  },

  taskDate: function () {
    return Template.instance().dueDate.get();
  }
});


Template.taskEditor.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datepicker.datepicker('show');
  },

  'changeDate .date-picker-input': function (event, tmpl) {
    Template.instance().dueDate.set(event.date);
    tmpl.datepicker.datepicker('hide');
  },

  'click .remove-task': function (event, tmpl) {
    event.preventDefault();
    Meteor.call('removeTask', tmpl.data.task, HospoHero.handleMethodResult(function () {
      tmpl.data.onCreateTaskAction();
    }));
  },

  'submit form': function (event, tmpl) {
    var getReference = function () {
      var $referenceSelector = tmpl.$('.reference-selector');
      if ($referenceSelector.val() !== '') {
        // get reference type (menu, job or supplier) based on parent optgroup label
        var referenceType = $referenceSelector.find('option:selected').parent().attr('label');
        referenceType = referenceType.replace(' ', '').toLowerCase();

        return {
          id: $referenceSelector.val(),
          type: referenceType
        };
      } else {
        return {};
      }
    };

    var getSharedUserIds = function () {
      var taggedUsers = [Meteor.userId()];
      var selectedOptions = tmpl.$('.user-selector').find('option:selected');

      selectedOptions.each(function(index, option) {
        taggedUsers.push(option.value);
      });
      return taggedUsers;
    };

    var getTaskDurationInMinutes = function (durationString) {
      var durationRegEx = /(\d+)\s?(\S+)/;

      var duration = durationString.match(durationRegEx);
      var timeUnitsNumber = duration[1];
      var timeUnitName = duration[2];

      var timeUnits = {
        hours: {
          names: ['h', 'hour', 'hours'],
          multiplier: 60
        },
        minutes: {
          names: ['m', 'min', 'minute', 'minutes'],
          multiplier: 1
        }
      };

      Object.keys(timeUnits).forEach(function(key) {
        var timeUnit = timeUnits[key];
        if (timeUnit.names.indexOf(timeUnitName) > -1) {
          timeUnitsNumber *= timeUnit.multiplier;
        }
      });

      return timeUnitsNumber;
    };


    event.preventDefault();
    var newTaskInfo = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'new-task-title',
        newName: 'title'
      },
      {
        name: 'new-task-description',
        newName: 'description'
      },
      {
        name: 'task-duration',
        newName: 'duration',
        transform: getTaskDurationInMinutes
      }
    ], true);

    if (newTaskInfo.title === '') {
      HospoHero.error('Task must have a title!');
    } else {
      // if we share task between users, get them ids
      if (tmpl.sharingType.get() === 'users') {
        tmpl.sharingIds.set(getSharedUserIds());
      }

      var additionalTaskParams = {
        done: false,
        dueDate: tmpl.datepicker.datepicker('getDate'),
        sharingType: tmpl.sharingType.get(),
        sharingIds: tmpl.sharingIds.get(),
        reference: getReference()
      };
      newTaskInfo = _.extend(newTaskInfo, additionalTaskParams);

      var method = 'createTask';
      if (tmpl.data.task._id) {
        method = 'editTask';
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