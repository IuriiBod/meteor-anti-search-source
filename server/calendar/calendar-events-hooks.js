/**
 * Uses for update shift start/end time if the event doesn't
 * fit in shift time
 * @param {String} userId - ID of user which create/update event
 * @param {Object} event - CalendarEvent object
 */
let calendarEventInsertUpdateHook = function (userId, event) {
  let areaId = HospoHero.getCurrentAreaId(userId);
  let shift = Shifts.findOne({
    startTime: TimeRangeQueryBuilder.forDay(event.startTime, event.locationId),
    'relations.areaId': areaId
  });

  // if there are a shift for current day, update it if need
  if (!!shift) {
    if (shift.startTime > event.startTime || shift.endTime < event.endTime) {
      if (shift.startTime > event.startTime) {
        shift.startTime = event.startTime;
      }
      if (shift.endTime < event.endTime) {
        shift.endTime = event.endTime;
      }
      Meteor.call('editShift', shift);
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
};


CalendarEvents.before.insert(function (userId, event) {
  calendarEventInsertUpdateHook(userId, event);
});

CalendarEvents.after.update(function (userId, event) {
  calendarEventInsertUpdateHook(userId, event);
});

// TODO: Uncomment if we need to remove the shift after removing the last event
//CalendarEvents.before.remove(function (userId, event) {
//  // when we remove the last event of the day, remove the shift too
//  if (CalendarEvents.find({shiftId: event.shiftId}).count() === 1) {
//    Shifts.remove({_id: event.shiftId});
//  }
//});