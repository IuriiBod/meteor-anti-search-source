Template.calendarGreyZone.helpers({
  greyZoneTime () {
    let shift = getShift(this);

    if (shift) {
      let currentEvent = getCurrentEvent(this);
      let nextCalendarEvent = getNextCalendarEvent(currentEvent, shift);

      let startTime = currentEvent && currentEvent.endTime || shift.startTime;
      let endTime = nextCalendarEvent && nextCalendarEvent.startTime || shift.endTime;

      return {
        startTime,
        endTime
      };
    }
  },

  greyZoneNeeded (greyZoneTimes) {
    if (greyZoneTimes) {
      return moment(greyZoneTimes.endTime).diff(greyZoneTimes.startTime, 'minutes') >= 5;
    }
  }
});


function getShift (templateData) {
  let query = {};

  if (templateData.shiftId) {
    query._id = templateData.shiftId;
  } else {
    let shiftDate = new Date(templateData.date);

    _.extend(query, {
      startTime: TimeRangeQueryBuilder.forDay(shiftDate),
      assignedTo: templateData.userId
    });
  }

  return Shifts.findOne(query);
}

function getCurrentEvent (templateData) {
  if (templateData._id) {
    return CalendarEvents.findOne({_id: templateData._id});
  } else {
    return false;
  }
}

function getNextCalendarEvent (currentEvent, shift) {
  let endOfDay = (date) => {
    return moment(date).endOf('day').toDate();
  };

  let startTime = shift.startTime;
  let query = {
    shiftId: shift._id
  };

  if (currentEvent) {
    query._id = {$ne: currentEvent._id};
    startTime = currentEvent.startTime;
  }

  _.extend(query, {
    $and: [
      {startTime: {$gte: startTime}},
      {startTime: {$lt: endOfDay(startTime)}}
    ]
  });

  return CalendarEvents.findOne(query);
}