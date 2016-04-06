// context date: (Date), titleType: (String) userId: (MongoId)

Template.calendarItem.helpers({
  todayEvents () {
    return CalendarEvents.find({
      startTime: TimeRangeQueryBuilder.forDay(this.date),
      userId: this.userId
    }, {
      sort: {
        startTime: 1
      }
    });
  },

  calendarItemTitle () {
    if (this.type === 'manager') {
      return HospoHero.username(this.userId);
    } else if (this.type === 'week') {
      return HospoHero.dateUtils.dateFormat(this.date);
    } else {
      return false;
    }
  },

  isDailyUserCalendar () {
    return this.type === 'day';
  },

  sortableOptions () {
    return {
      group: {
        name: 'calendarEvents',
        // allow move events out from list
        pull: true,
        // allow put events only from newEvents group
        put: ['newEvents']
      },

      // disable dragging of .grey-zone elements
      filter: '.grey-zone, .started',

      onAdd (event) {
        let addedEvent = new EventSortableHelper(event).getSortedEvent();
        FlyoutManager.open('eventItemFlyout', {event: addedEvent});
      },

      // don't remove this!
      onUpdate () {},
      onRemove () {}
    };
  }
});


Template.calendarItem.events({
  'click .calendar-item-title' (event, tmpl) {
    let tmplData = tmpl.data;

    Router.go('calendar', {
      type: 'day',
      date: HospoHero.dateUtils.shortDateFormat(tmplData.date),
      userId: tmplData.userId
    });
  }
});