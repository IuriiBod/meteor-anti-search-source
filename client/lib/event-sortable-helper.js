EventSortableHelper = class EventSortableHelper {
  constructor(event) {
    let draggedEvent = event.data;
    let eventObject = CalendarEvents.findOne({
      itemId: draggedEvent.itemId,
      shiftId: draggedEvent.shiftId,
      userId: event.userId
    });

    this._draggedEvent = eventObject || draggedEvent;
    this._draggedToData = this._getDataByItem(event.target);
  }

  _getDataByItem(element) {
    return element ? Blaze.getData(element) : null;
  }

  _fixEventStartEndTime(date) {
    let event = this._draggedEvent;
    let duration = getEventDuration(event);

    let startTime = HospoHero.dateUtils.applyTimeToDate(date, event.startTime);
    let endTime = moment(startTime).add(duration.asMinutes(), 'minutes').toDate();

    return _.extend(event, {
      startTime,
      endTime
    });
  }

  getSortedEvent() {
    if (this._draggedEvent) {
      let event = this._draggedEvent;
      let newEventData = this._draggedToData;
      let newDate = new Date(newEventData.date);
      let areaId = HospoHero.getCurrentAreaId(Meteor.userId());

      // find the shift for new date for current user
      let shift = Shifts.findOne({
        assignedTo: newEventData.userId,
        startTime: TimeRangeQueryBuilder.forDay(newDate),
        'relations.areaId': areaId
      });

      if (shift) {
        event.shiftId = shift._id;
      } else {
        delete event.shiftId;
        event.areaId = areaId;
      }

      event = this._fixEventStartEndTime(newDate);

      event.userId = newEventData.userId;

      if (event.startedAt) {
        event.startedAt = HospoHero.dateUtils.applyTimeToDate(newDate, event.startedAt);
      }

      check(event, HospoHero.checkers.CalendarEventDocument);
      return event;
    }
  }
};

function getEventDuration(event) {
  let eventSettings = HospoHero.calendar.getEventByType(event.type);
  let eventItem = HospoHero.calendar.getEventItem(event);

  let duration;

  // set the default duration
  let defaultDuration = moment.duration('00:30');

  if (eventSettings.duration && _.isFunction(eventSettings.duration)) {
    duration = eventSettings.duration(eventItem);
  }

  return duration ? moment.duration(duration) : moment.duration(defaultDuration);
}