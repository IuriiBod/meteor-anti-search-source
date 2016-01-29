/**
 * Hooks for tracking changes in shifts and job items.
 * It is related to the calendar events.
 *
 * We don't use JobItems remove hook, because before removing,
 * job item must be archived. Archiving - is an update operation.
 * That's why only insert and update hooks are used.
 *
 * We use only update hook for shift, because when shift
 * just created, it has no assignedTo and section IDs. When
 * the shift was removed, it was updated before it (removed
 * assigned user). So, that's why only update hook uses.
 */
var calendarEventsManager = new CalendarEventsManager();

var jobItemUpdate = function (newJobItem, oldJobItem) {
  if (newJobItem.frequency) {
    var today = HospoHero.dateUtils.getDateMomentForLocation(new Date(), newJobItem.relations.locationId);
    today = today.startOf('week');

    var query = {
      startTime: {
        $gte: today.toDate()
      },
      published: true
    };

    if (oldJobItem) {
      query.section = {$in: [oldJobItem.section, newJobItem.section]};
    } else {
      query.section = newJobItem.section;
    }

    // finding shifts, which depends on changed job item
    Shifts.find(query).forEach(function (shift) {
      if (newJobItem.status === 'active') {
        calendarEventsManager.addJobsToCalendar(shift);
      } else {
        CalendarEvents.remove({shiftId: shift._id});
      }
    });
  }
};

JobItems.after.insert(function (userId, jobItem) {
  jobItemUpdate(jobItem);
});

JobItems.after.update(function (userId, newJobItem) {
  var oldJobItem = this.previous;
  jobItemUpdate(newJobItem, oldJobItem);
});


Shifts.after.update(function (userId, newShift) {
  if (newShift.published) {
    var oldShift = this.previous;

    // when the assigned user was changed,
    // move old user's jobs to the new user
    if (newShift.assignedTo !== oldShift.assignedTo) {
      CalendarEvents.update({shiftId: newShift._id}, {
        $set: {
          userId: newShift.assignedTo
        }
      }, {multi: true});
    } else {
      CalendarEvents.remove({shiftId: newShift._id});
      calendarEventsManager.addJobsToCalendar(newShift);
    }
  }
});