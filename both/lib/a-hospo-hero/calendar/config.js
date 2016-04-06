Namespace('HospoHero.calendar', {
  /**
   * Object with available calendar events
   *
   * eventType: {
   *   title - event title to display
   *   collection - Mongo.Collection name to select items
   *   queryOptions - function that renurns options to insert into find() method
   *   eventSettings - settings used in calendar events rendering
   *   {
   *     titleField - field with the item name
   *     flyoutTemplate - the name of template to render after click on event
   *   }
   *   manualAllocating - if true - allow to allocate items manually
   *   duration - object with item duration settings
   *   {
   *     field - document field with duration
   *     timeUnits - units in what duration measured (seconds, minutes, ...)
   *   }
   * }
   */
  events: {
    'recurring job': {
      title: 'Recurring Job',
      collection: 'jobItems',
      titleField: 'name',
      borderColor: '#1AB394',
      flyoutTemplate: 'eventRecurringJob',

      queryOptions: function () {
        return {
          frequency: {
            $exists: true
          }
        };
      },

      duration: function (job) {
        return moment.duration(job.activeTime, 'seconds');
      }
    },

    'prep job': {
      title: 'Prep Job',
      collection: 'jobItems',
      titleField: 'name',
      borderColor: '#23C6C8',
      flyoutTemplate: 'eventPrepJob',

      queryOptions: function () {
        return {
          frequency: {
            $exists: false
          }
        };
      },

      duration: function (job) {
        return moment.duration(job.activeTime, 'seconds');
      }
    },

    task: {
      title: 'Task',
      collection: 'taskList',
      titleField: 'title',
      borderColor: '#27a0c9',
      flyoutTemplate: 'eventTask',

      queryOptions: function (date, calendarType, userId) {
        var queryType = HospoHero.calendar.getQueryType(calendarType);
        var currentDate = TimeRangeQueryBuilder[queryType](date);

        var placedTasks = CalendarEvents.find({startTime: currentDate}).map(function (event) {
          return event.itemId;
        });

        var query = HospoHero.misc.getTasksQuery(Meteor.userId(), userId);

        return _.extend(query, {
          _id: {
            $nin: placedTasks
          },
          dueDate: currentDate,
          done: false
        });
      },

      duration: function (task) {
        return task.duration !== 0 ? moment.duration(task.duration, 'minutes') : false;
      }
    },

    meeting: {
      title: 'Meeting',
      collection: 'meetings',
      titleField: 'title',
      borderColor: '#b35cd6',
      flyoutTemplate: 'eventMeeting',

      queryOptions: function (date, calendarType, userId) {
        return {
          attendees: userId,
          accepted: userId
        };
      },

      duration: function (meeting) {
        let duration = moment(meeting.endTime).diff(meeting.startTime, 'minutes');
        return moment.duration(duration, 'minutes');
      }
    },

    project: {
      title: 'Project',
      collection: 'projects',
      titleField: 'title',
      borderColor: '#F1B755',
      flyoutTemplate: 'eventProject',

      queryOptions: function (date, calendarType, userId) {
        return {
          lead: userId,
          team: userId
        };
      },

      duration: function (project) {
        let duration = moment(project.endTime).diff(project.startTime, 'minutes');
        return moment.duration(duration);
      }
    }
  }
});