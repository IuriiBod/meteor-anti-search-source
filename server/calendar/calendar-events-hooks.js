let getAreaIdFromEvent = event => {
  if (event.areaId) {
    return event.areaId;
  } else {
    let shift = Shifts.findOne({_id: event.shiftId});
    return shift.relations.areaId;
  }
};

let eventsOverlapping = (event) => {
  let startTime = event.startTime;
  let endTime = event.endTime;

  let existedCalendarEvents = CalendarEvents.findOne({
    _id: {
      $ne: event._id
    },
    userId: event.userId,

    $or: [
      {
        startTime: {$lt: startTime},
        endTime: {$gt: endTime}
      },
      {
        $and: [
          {startTime: {$gt: startTime}},
          {startTime: {$lt: endTime}}
        ]
      },
      {
        $and: [
          {endTime: {$gt: startTime}},
          {endTime: {$lt: endTime}}
        ]
      }
    ]
  });

  return !!existedCalendarEvents;
};

/**
 * Uses for update shift start/end time if the event doesn't
 * fit in shift time
 * @param {String} userId - ID of user which create/update event
 * @param {Object} event - CalendarEvent object
 */
Namespace('HospoHero.calendar', {
  eventInsertUpdateHook (event) {
    let areaId = getAreaIdFromEvent(event);
    let shift = Shifts.findOne({
      startTime: TimeRangeQueryBuilder.forDay(event.startTime, event.locationId),
      'relations.areaId': areaId,
      assignedTo: event.userId
    });

    // if there are a shift for current day, update it if need
    if (!!shift) {
      let startShiftMoment = moment(shift.startTime);
      let endShiftMoment = moment(shift.endTime);

      // check that event is placed in shift time
      if (startShiftMoment.isAfter(event.startTime) || endShiftMoment.isBefore(event.endTime)) {
        throw new Meteor.Error('Event isn\'t placed in shift time!');
      }

      if (eventsOverlapping(event)) {
        throw new Meteor.Error('Events are overlapping!');
      }
    } else {
      // if there are no shifts, create a one
      shift = _.pick(event, ['startTime', 'endTime']);
      _.extend(shift, {
        type: null,
        assignedTo: event.userId
      });
      Meteor.call('createShift', shift);
    }

    return true;
  }
});