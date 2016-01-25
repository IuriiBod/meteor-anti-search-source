var eventItemsSettings = {
  'recurring job': {
    collection: JobItems,
    titleField: 'name',
    backgroundColor: '#1AB394',
    textColor: '#FFF'
  }
};


Template.calendarItem.onCreated(function () {
  this.calendarType = this.data.type;

  // add or subtract 1 week or day and go to another router
  this.changeDate = function (action, step) {
    var calendarType = this.calendarType;
    var date = moment(new Date(this.data.date));

    // if calendar type is week - set current calendar date to the beginning of the week
    if (calendarType === 'week') {
      date = HospoHero.dateUtils.startOfWeekMoment(date);
    }

    // get string like date.add(1, 'day') at output
    if (action && step) {
      date[action](step, calendarType);
    }

    date = date.format('YYYY-MM-DD');
    Router.go('calendar', {date: date, type: calendarType});
  };

  // returns events need to render to the calendar
  this.getCalendarEvents = function () {
    var queryType = this.data.type === 'day' ? 'forDay' : 'forWeek';

    return CalendarEvents.find({
      userId: this.data.userId,
      date: TimeRangeQueryBuilder[queryType](this.data.date)
    }).map(function (event) {
      var currentEventItem = eventItemsSettings[event.type];
      var item = currentEventItem.collection.findOne({_id: event.itemId});

      return {
        id: event._id,
        title: item[currentEventItem.titleField],
        start: moment(event.startTime),
        end: moment(event.endTime),
        backgroundColor: currentEventItem.backgroundColor,
        textColor: currentEventItem.textColor,
        item: event
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
        header: {
          right: 'agendaDay, agendaWeek, prev, next'
        },
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

        eventClick: function () {

        }
      }
    }
  }
});


Template.calendarItem.events({
  'click .fc-prev-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.changeDate('subtract', 1);
  },

  'click .fc-next-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.changeDate('add', 1);
  },

  'click .fc-agendaDay-button': function (event, tmpl) {
    tmpl.calendarType = 'day';
    tmpl.changeDate();
  },

  'click .fc-agendaWeek-button': function (event, tmpl) {
    tmpl.calendarType = 'week';
    tmpl.changeDate();
  }
});