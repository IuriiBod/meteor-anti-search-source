Template.calendarItem.onCreated(function () {
  this.calendarId = this.data.userId || 'manager-calendar';
});


Template.calendarItem.onRendered(function () {
  this.calendar = this.$('#' + this.calendarId);
});


Template.calendarItem.helpers({
  calendarOptions: function () {
    var area = HospoHero.getCurrentArea();
    if (area) {
      var tmpl = Template.instance();

      var calendarOptions = {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

        id: tmpl.calendarId,
        header: false,
        defaultView: this.type === 'day' ? 'agendaDay' : 'agendaWeek',
        defaultDate: this.date,
        firstDay: 1,
        displayTime: true,
        allDaySlot: false,
        slotDuration: "00:05",
        eventOverlap: false,
        height: 700,
        scrollTime: "08:00",

        eventStartEditable: true,
        eventDurationEditable: false,
        droppable: true,

        columnFormat: 'ddd DD/MM',
        timezone: 'local',

        events: function (start, end, timezone, callback) {
          let events = HospoHero.calendar.getCalendarEvents(tmpl.data);
          let backgroundEvents = HospoHero.calendar.getBackgroundEvents(tmpl.data);

          callback(_.union(events, backgroundEvents));
        },

        eventClick: function (eventObject) {
          if (eventObject.item.type !== 'busy') {
            FlyoutManager.open('eventItemFlyout', {eventObject: eventObject});
          }
        },

        eventReceive: function (receivedObject) {
          var event = {
            itemId: receivedObject.id,
            startTime: receivedObject.start.toDate(),
            endTime: receivedObject.end.toDate(),
            type: receivedObject.type,
            userId: tmpl.data.userId || receivedObject.resourceId,
            locationId: area.locationId,
            areaId: area._id
          };

          tmpl.calendar.fullCalendar('removeEvents', receivedObject.id);
          Meteor.call('addCalendarEvent', event, HospoHero.handleMethodResult());
        },

        eventDrop: function (newEventObject) {
          var eventObject = newEventObject.item;
          var eventSettings = HospoHero.calendar.getEventByType(eventObject.type);

          // allow moving only manual allocating events
          if (eventSettings.manualAllocating) {
            _.extend(eventObject, {
              startTime: newEventObject.start.toDate(),
              endTime: newEventObject.end.toDate(),
              userId: newEventObject.resourceId
            });
            Meteor.call('editCalendarEvent', eventObject, function (error) {
              if (error) {
                HospoHero.error(error);
              }
            });
          }

          tmpl.calendar.fullCalendar('refetchEvents');
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
  },

  'click .fc-resource-cell': function (event, tmpl) {
    Router.go('calendar', {
      type: 'day',
      date: HospoHero.dateUtils.shortDateFormat(tmpl.data.date),
      userId: event.target.dataset.resourceId
    });
  }
});