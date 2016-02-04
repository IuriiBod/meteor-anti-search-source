Namespace('HospoHero.calendar', {
  getQueryType: function (calendarType) {
    return calendarType === 'day' ? 'forDay' : 'forWeek';
  },

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
        var query = HospoHero.misc.getTasksQuery(userId);
        return _.extend(query, {
          dueDate: TimeRangeQueryBuilder[queryType](date),
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
  },

  /**
   * Returns event object by event type
   * @param eventType
   * @returns {Object|boolean}
   */
  getEventByType: function (eventType) {
    return this.events[eventType] || false;
  },

  /**
   * Returns an array of events' names
   * @param onlyManualAllocated - if true - returns only manually allocated events' names
   * @returns {Array}
   */
  getEventNames: function (onlyManualAllocated) {
    var events = _.map(this.events, function (eventObject, eventName) {
      if (!onlyManualAllocated || onlyManualAllocated && eventObject.manualAllocating) {
        return eventName;
      } else {
        return false;
      }
    });
    return _.compact(events);
  },

  /**
   * Returns events need to render to the calendar
   * @param {Object} calendarTemplateData
   * @param {String} calendarTemplateData.type - type of the calendar (day or week)
   * @param {String} calendarTemplateData.date - the date of calendar
   * @param {String} [calendarTemplateData.userId] - the ID of user for which calendar is displaying
   * @param {Object[]} [calendarTemplateData.resources] - the calendar resourse object
   * @param {string} calendarTemplateData.resources[].id - the ID of resource (userId)
   * @param {string} [calendarTemplateData.resources[].title] - the name of user
   * @returns {*}
   */
  getCalendarEvents: function (calendarTemplateData) {
    var queryType = this.getQueryType(calendarTemplateData.type);

    /**
     * Returns array of events object of selected user and date
     * @param userId
     * @param date
     * @returns {Array}
     */
    var getEvents = function (userId, date) {
      return CalendarEvents.find({
        userId: userId,
        startTime: TimeRangeQueryBuilder[queryType](date)
      }).map(function (event) {
        var currentEventItem = HospoHero.calendar.getEventByType(event.type);
        var eventSettings = currentEventItem.eventSettings;
        var item = Mongo.Collection.get(currentEventItem.collection).findOne({_id: event.itemId});

        if (item) {
          return {
            id: event._id,
            resourceId: userId,
            title: item[eventSettings.titleField],
            start: moment(event.startTime),
            end: moment(event.endTime),
            backgroundColor: eventSettings.backgroundColor,
            textColor: eventSettings.textColor,
            item: event
          }
        } else {
          return {};
        }
      });
    };

    var date = calendarTemplateData.date;

    if (calendarTemplateData.userId) {
      // get events only for one user
      return getEvents(calendarTemplateData.userId, date);
    } else if (calendarTemplateData.resources && calendarTemplateData.resources.length) {
      // get event for array of users
      return _.flatten(_.map(calendarTemplateData.resources, function (resource) {
        return getEvents(resource.id, date);
      }));
    } else {
      return [];
    }
  }
});