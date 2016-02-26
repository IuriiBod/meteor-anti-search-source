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
      queryOptions: function () {
        return {
          frequency: {
            $exists: true
          }
        }
      },
      eventSettings: {
        titleField: 'name',
        backgroundColor: '#1AB394',
        borderColor: '#1AB394',
        textColor: '#FFF',
        flyoutTemplate: 'eventRecurringJob'
      },
      manualAllocating: false,
      duration: {
        field: 'activeTime',
        timeUnits: 'seconds'
      }
    },

    'prep job': {
      title: 'Prep Job',
      collection: 'jobItems',
      queryOptions: function () {
        return {
          frequency: {
            $exists: false
          }
        }
      },
      eventSettings: {
        titleField: 'name',
        backgroundColor: '#23C6C8',
        borderColor: '#23C6C8',
        textColor: '#FFF',
        flyoutTemplate: 'eventPrepJob'
      },
      manualAllocating: true,
      duration: {
        field: 'activeTime',
        timeUnits: 'seconds'
      }
    },

    'task': {
      title: 'Task',
      collection: 'taskList',
      queryOptions: function (date, calendarType, userId) {
        var queryType = HospoHero.calendar.getQueryType(calendarType);
        var currentDate = TimeRangeQueryBuilder[queryType](date);

        var placedTasks = CalendarEvents.find({startTime: currentDate}).map(function (event) {
          return event.itemId
        });

        var query = HospoHero.misc.getTasksQuery(userId);

        return _.extend(query, {
          _id: {
            $nin: placedTasks
          },
          dueDate: currentDate,
          done: false
        });
      },
      eventSettings: {
        titleField: 'title',
        backgroundColor: '#27a0c9',
        borderColor: '#27a0c9',
        textColor: '#FFF',
        flyoutTemplate: 'eventTask'
      },
      manualAllocating: true,
      duration: {
        field: 'duration',
        timeUnits: 'minutes'
      }
    }
  }
});