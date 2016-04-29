let canUserEditCalendar = (areaId) => {
  if (areaId) {
    let checker = new HospoHero.security.PermissionChecker();
    return checker.hasPermissionInArea(areaId, 'edit calendar');
  }
  return false;
};

let getAreaIdFromShift = (shiftId) => {
  let shift = Shifts.findOne({_id: shiftId});
  return shift ? shift.relations.areaId : null;
};

let getEventAreaId = (eventObject) => {
  return eventObject.shiftId ? getAreaIdFromShift(eventObject.shiftId) : eventObject.areaId;
};

let updateEventSeconds = (event) => {
  let setSecondsToZero = (date) => {
    date.setSeconds(0);
    return date;
  };

  _.extend(event, {
    startTime: setSecondsToZero(event.startTime),
    endTime: setSecondsToZero(event.endTime)
  });
  return event;
};

Meteor.methods({
  addCalendarEvent: function (eventObject) {
    // when we don't know the shift ID
    // we pass area ID for find this shift
    let areaId = getEventAreaId(eventObject);

    HospoHero.calendar.eventInsertUpdateHook(eventObject);

    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!canUserEditCalendar(areaId)) {
      logger.error("User not permitted to add items onto calendar");
      throw new Meteor.Error(403, "User not permitted to add items onto calendar");
    } else {
      // set seconds of start/end times equal to 0
      eventObject = updateEventSeconds(eventObject);

      return CalendarEvents.insert(eventObject);
    }
  },

  editCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    let areaId = getEventAreaId(eventObject);

    if (!canUserEditCalendar(areaId)) {
      logger.error("User not permitted to edit calendar items");
      throw new Meteor.Error(403, "User not permitted to edit calendar items");
    } else {
      eventObject = updateEventSeconds(eventObject);

      HospoHero.calendar.eventInsertUpdateHook(eventObject);

      CalendarEvents.update({_id: eventObject._id}, {$set: eventObject});
    }
  },

  removeCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    let areaId = getEventAreaId(eventObject);

    if (!canUserEditCalendar(areaId)) {
      logger.error("User not permitted to delete items from calendar");
      throw new Meteor.Error(403, "User not permitted to delete items from calendar");
    } else {
      CalendarEvents.remove({_id: eventObject._id});
    }
  }
});
