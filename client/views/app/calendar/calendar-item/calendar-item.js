var eventItemsSettings = {
  'recurring job': {
    collection: JobItems,
    titleField: 'name',
    backgroundColor: '#1AB394',
    textColor: '#FFF'
  }
};


Template.calendarItem.onCreated(function () {
  // returns events need to render to the calendar
  this.getCalendarEvents = function () {
    var queryType = this.data.type === 'day' ? 'forDay' : 'forWeek';

    return CalendarEvents.find({
      userId: this.data.userId,
      startTime: TimeRangeQueryBuilder[queryType](this.data.date)
    }).map(function (event) {
      var currentEventItem = eventItemsSettings[event.type];
      var item = currentEventItem.collection.findOne({_id: event.itemId});

      if (item) {
        return {
          id: event._id,
          title: item[currentEventItem.titleField],
          start: moment(event.startTime),
          end: moment(event.endTime),
          backgroundColor: currentEventItem.backgroundColor,
          textColor: currentEventItem.textColor,
          item: event
        }
      } else {
        return {};
      }
    });
  };
});


Template.calendarItem.helpers({
  calendarOptions: function () {
    // If the type of a calendar is Manager - do not displaying agendaWeek button
    //var headerButtons = this.type === 'manager' ? '' : 'agendaDay, agendaWeek';

    var area = HospoHero.getCurrentArea();
    if (area) {
      var tmpl = Template.instance();
      var location = Locations.findOne({_id: area.locationId});

      return {
        id: this.userId,
        header: false,
        defaultView: this.type === 'day' ? 'agendaDay' : 'agendaWeek',
        defaultDate: this.date,
        firstDay: 1,
        displayTime: true,
        timezone: location.timezone,

        allDaySlot: false,

        columnFormat: 'ddd DD/MM',

        events: function (start, end, timezone, callback) {
          var events = tmpl.getCalendarEvents();
          callback(events);
        },

        eventClick: function (eventObject) {
          FlyoutManager.open('eventItemFlyout', {eventObject: eventObject});
        }
      }
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