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