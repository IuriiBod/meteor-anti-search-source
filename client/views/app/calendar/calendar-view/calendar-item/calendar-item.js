Template.calendarItem.onCreated(function () {
  // returns events need to render to the calendar
  this.getCalendarEvents = function () {
    var queryType = this.data.type === 'day' ? 'forDay' : 'forWeek';

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

    var date = this.data.date;

    if (this.data.userId) {
      // get events only for one user
      return getEvents(this.data.userId, date);
    } else if (this.data.resources && this.data.resources.length) {
      // get event for array of users
      return _.flatten(_.map(this.data.resources, function (resource) {
        return getEvents(resource.id, date);
      }));
    } else {
      return [];
    }
  };
});


Template.calendarItem.helpers({
  calendarOptions: function () {
    var area = HospoHero.getCurrentArea();
    if (area) {
      var tmpl = Template.instance();
      var managerCalendarId = 'manager-calendar';

      var calendarOptions = {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

        id: this.userId || managerCalendarId,
        header: false,
        defaultView: this.type === 'day' ? 'agendaDay' : 'agendaWeek',
        defaultDate: this.date,
        firstDay: 1,
        displayTime: true,
        allDaySlot: false,
        slotDuration: "00:30",
        eventOverlap: false,
        height: 700,
        scrollTime: 0,

        eventStartEditable: true,
        eventDurationEditable: false,
        droppable: true,

        columnFormat: 'ddd DD/MM',
        timezone: 'local',

        events: function (start, end, timezone, callback) {
          var events = tmpl.getCalendarEvents();
          callback(events);
        },

        eventClick: function (eventObject) {
          FlyoutManager.open('eventItemFlyout', {eventObject: eventObject});
        },

        eventReceive: function (receivedObject) {
          var event = {
            itemId: receivedObject.id,
            startTime: receivedObject.start.toDate(),
            endTime: receivedObject.end.toDate(),
            type: receivedObject.type,
            userId: receivedObject.resourceId,
            locationId: area.locationId,
            areaId: area._id
          };

          tmpl.$('#' + managerCalendarId).fullCalendar('removeEvents', receivedObject.id);
          Meteor.call('addCalendarEvent', event, HospoHero.handleMethodResult());
        },

        eventDrop: function (newEventObject) {
          var eventObject = newEventObject.item;
          _.extend(eventObject, {
            startTime: newEventObject.start.toDate(),
            endTime: newEventObject.end.toDate(),
            userId: newEventObject.resourceId
          });
          Meteor.call('editCalendarEvent', eventObject, function (error) {
            if (error) {
              HospoHero.error(error);
              tmpl.$('#' + managerCalendarId).fullCalendar('refetchEvents');
            }
          });
        }
      };

      // add additional parameters for timeline view
      if (this.resources && this.resources.length) {
        _.extend(calendarOptions, {
          resources: this.resources
        });
      }

      return calendarOptions;
    }
  }
});


Template.calendarItem.events({
  'click .fc-day-header': function (event, tmpl) {
    var selectedDateText = tmpl.$(event.currentTarget).text();
    var selectedDateMoment = moment(selectedDateText, 'ddd DD/MM');
    Router.go('calendar', {
      type: 'day',
      date: HospoHero.dateUtils.shortDateFormat(selectedDateMoment),
      userId: tmpl.data.userId
    });
  }
});