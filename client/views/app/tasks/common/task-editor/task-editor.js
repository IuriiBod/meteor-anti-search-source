Template.taskEditor.onCreated(function () {
  var task = this.data.task;
  var dueDate = task.dueDate && task.dueDate > new Date() ? task.dueDate : new Date();

  this.dueDate = new ReactiveVar(dueDate);
  this.sharingType = new ReactiveVar(task.sharing && task.sharing.type || 'private');
  this.sharingIds = new ReactiveVar(task.sharing && task.sharing.id || Meteor.userId());
});


Template.taskEditor.onRendered(function () {
  this.$('.new-task-title').focus();

  this.datepicker = this.$('.date-picker-input');
  this.datepicker.datepicker({
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
    };
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
      var task = tmpl.data.task;

      if (task && task.reference && task.reference.id && task.reference.type) {
        return task.reference;
      }

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
      var taggedUsers = [];
      var selectedOptions = tmpl.$('.user-selector').find('option:selected');

      selectedOptions.each(function (index, option) {
        taggedUsers.push(option.value);
      });
      return taggedUsers.length ? taggedUsers : [Meteor.userId()];
    };

    var getTaskDurationInMinutes = function (durationString) {
      var durationInMinutes = 0;

      if (durationString.trim()) {
        var durationRegEx = /(\d+)\s?(\S+)/g;

        var timeUnits = {
          hours: {
            names: ['h', 'hour', 'hours'],
            multiplier: 60
          },
          minutes: {
            names: ['m', 'min', 'mins', 'minute', 'minutes'],
            multiplier: 1
          }
        };

        var helper = function () {
          return function (key) {
            var timeUnit = timeUnits[key];
            if (timeUnit.names.indexOf(timeUnitName) > -1) {
              timeUnitsNumber *= timeUnit.multiplier;
              durationInMinutes += timeUnitsNumber;
            }
          };
        };

        let duration;
        while (duration = durationRegEx.exec(durationString)) {
          if (duration) {
            var timeUnitsNumber = duration[1];
            var timeUnitName = duration[2];

            Object.keys(timeUnits).forEach(helper());
          }
        }
      }

      // when we've got only a number like a 30, consider that this is
      // a duration in minutes
      if (durationInMinutes === 0 && !_.isNaN(parseInt(durationString))) {
        return parseInt(durationString);
      } else {
        return durationInMinutes;
      }
    };


    event.preventDefault();
    var taskInfo = HospoHero.misc.getValuesFromEvent(event, [
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

    if (taskInfo.title === '') {
      HospoHero.error('Task must have a title!');
    } else {
      var additionalTaskParams = {
        done: false,
        dueDate: tmpl.datepicker.datepicker('getDate'),
        assignedTo: getSharedUserIds(),
        sharing: {
          type: tmpl.sharingType.get(),
          id: tmpl.sharingIds.get()
        },
        createdBy: Meteor.userId(),
        reference: getReference()
      };
      taskInfo = _.extend(taskInfo, additionalTaskParams);

      var method = 'createTask';
      if (tmpl.data.task._id) {
        method = 'editTask';
        taskInfo._id = tmpl.data.task._id;
      }

      Meteor.call(method, taskInfo, HospoHero.handleMethodResult(function () {
        tmpl.data.onCreateTaskAction();
      }));
    }
  },

  'click .close-create-new-task-container': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onCreateTaskAction();
  }
});