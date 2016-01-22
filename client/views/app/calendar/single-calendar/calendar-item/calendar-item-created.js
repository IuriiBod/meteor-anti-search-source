var eventItemsSettings = {
  'recurring job': {
    collection: JobItems,
    titleField: 'name',
    backgroundColor: '#1AB394',
    textColor: '#FFF'
  }
};


Template.calendarItem.onCreated(function () {
  var self = this;
  this.changeDate = function (action, step) {
    var date = moment(new Date(self.data.date));
    date = moment(date)[action](step, self.data.type).format('YYYY-MM-DD');
    Router.go('calendar', {date: date});
  };

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