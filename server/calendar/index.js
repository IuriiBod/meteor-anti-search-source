var canUserEditCalendar = function () {
  let checker = new HospoHero.security.PermissionChecker(Meteor.userId());
  return checker.hasPermissionInArea(HospoHero.getCurrentAreaId(), 'edit calendar');
};

Meteor.methods({
  addCalendarEvent: function (eventObject) {
    // when we don't know the shift ID
    // we pass area ID for find this shift
    if (!eventObject.shiftId && eventObject.areaId) {
      var shiftTimeRange = TimeRangeQueryBuilder.forDay(eventObject.startTime, eventObject.locationId);
      // need for selecting query
      var areaId = eventObject.areaId;
      delete eventObject.areaId;

      // get the user's shift for current day
      var shift = Shifts.findOne({
        startTime: shiftTimeRange,
        assignedTo: eventObject.userId,
        'relations.areaId': areaId
      });

      if (shift) {
        eventObject.shiftId = shift._id;
      } else {
        // if there are no shifts, create a one
        shift = _.pick(eventObject, ['startTime', 'endTime']);
        _.extend(shift, {
          type: null,
          assignedTo: eventObject.userId
        });
        eventObject.shiftId = Meteor.call('createShift', shift);
      }
    }

    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!canUserEditCalendar()) {
      logger.error("User not permitted to add items onto calendar");
      throw new Meteor.Error(403, "User not permitted to add items onto calendar");
    } else {
      CalendarEvents.insert(eventObject);
    }
  },

  editCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!canUserEditCalendar()) {
      logger.error("User not permitted to edit calendar items");
      throw new Meteor.Error(403, "User not permitted to edit calendar items");
    } else {
      CalendarEvents.update({_id: eventObject._id}, {$set: eventObject});
    }
  },

  removeCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!canUserEditCalendar()) {
      logger.error("User not permitted to delete items from calendar");
      throw new Meteor.Error(403, "User not permitted to delete items from calendar");
    } else {
      CalendarEvents.remove({_id: eventObject._id});
    }
  }
});
