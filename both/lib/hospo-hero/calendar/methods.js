Namespace('HospoHero.calendar', {
  getQueryType: function (calendarType) {
    return calendarType === 'day' ? 'forDay' : 'forWeek';
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
    var taskQuery = HospoHero.misc.getTasksQuery(Meteor.userId());

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

        var defaultEvent = {
          id: event._id,
          resourceId: userId,
          start: moment(event.startTime),
          end: moment(event.endTime),
          backgroundColor: eventSettings.backgroundColor,
          borderColor: eventSettings.backgroundColor,
          textColor: eventSettings.textColor,
          item: event
        };

        // WARNING!
        // THE FOC (full of crutches) CODE HERE!
        // DO NOT READ!
        // TODO: Need to refactor this... Move it away, maybe.. Or something smarter
        // 1) check if the current event is a task
        var taskItem = false;
        if (event.type === 'task') {
          var taskQueryCopy = _.clone(taskQuery);
          taskQueryCopy._id = event.itemId;
          taskQueryCopy.$or.push({assignedTo: Meteor.userId()});
          taskItem = Mongo.Collection.get(currentEventItem.collection).findOne(taskQueryCopy);
        }

        var item = Mongo.Collection.get(currentEventItem.collection).findOne({_id: event.itemId});

        // 2) than, check if a manager user can view this task
        if (event.type === 'task' && taskItem || event.type !== 'task' && item) {
          return _.extend(defaultEvent, {
            title: item[eventSettings.titleField]
          });
        } else if (event.type === 'task' && !taskItem && item) {
          // 3) if not - change the event view to Busy
          defaultEvent.item.type = 'busy';
          return _.extend(defaultEvent, {
            title: "Busy",
            backgroundColor: '#9C9C9C',
            borderColor: '#9C9C9C'
          });
        } else {
          return {};
        }
      });
    };

    let date = calendarTemplateData.date;
    let calendarResources = calendarTemplateData.resources;

    if (calendarTemplateData.userId) {
      // get events only for one user
      return _.flatten(getEvents(calendarTemplateData.userId, date));
    } else if (calendarResources && calendarResources.length) {
      // get event for array of users
      return _.flatten(_.map(calendarResources, function (resource) {
        return getEvents(resource.id, date);
      }));
    } else {
      return [];
    }
  },

  getBackgroundEvents(calendarTemplateData) {
    let getUsersShiftTime = (userId, areaId) => {
      const shift = Shifts.findOne({
        assignedTo: userId,
        'relations.areaId': areaId
      });

      if (shift) {
        return {
          start: shift.startTime,
          end: shift.endTime
        }
      } else {
        return false;
      }
    };

    let getBackgroundEventsObject = (time, userId) => {
      const backgroundColor = '#A5A7A5';
      let eventDateMoment = moment(time.start);

      return [
        {
          start: moment(eventDateMoment).startOf('day').toDate(),
          end: time.start,
          rendering: 'background',
          resourceId: userId,
          backgroundColor: backgroundColor
        },
        {
          start: time.end,
          end: moment(eventDateMoment).endOf('day').toDate(),
          rendering: 'background',
          resourceId: userId,
          backgroundColor: backgroundColor
        }
      ];
    };

    let getBackgroundEvents = (userId, areaId) => {
      const shiftTime = getUsersShiftTime(userId, areaId);
      if (shiftTime) {
        return getBackgroundEventsObject(shiftTime, userId)
      } else {
        return [];
      }
    };

    const managerUser = Meteor.userId();
    const areaId = HospoHero.getCurrentAreaId(managerUser);

    if (calendarTemplateData.userId) {
      return getBackgroundEvents(calendarTemplateData.userId, areaId);
    } else if (calendarTemplateData.resources) {
      return _.reduce(calendarTemplateData.resources, (memo, user) => {
        return _.union(memo, getBackgroundEvents(user.id, areaId));
      }, []);
    } else {
      return [];
    }
  }
});