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
        CalendarEventsManager.addRecurringJobsToCalendar(shift);
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
      CalendarEvents.remove({shiftId: newShift._id, type: 'recurring job'});
      CalendarEventsManager.addRecurringJobsToCalendar(newShift);
    }
});

let isPropertyChanged = function (propertyName, object1, object2) {
  if (_.isArray(object1[propertyName])) {
    return object1[propertyName].length !== object2[propertyName].length;
  } else if (_.isDate(object1[propertyName])) {
    return object1[propertyName].valueOf() !== object2[propertyName].valueOf();
  } else {
    return object1[propertyName] !== object2[propertyName];
  }
};

Meetings.after.update(function (userId, newMeeting) {
  let oldMeeting = this.previous;

  // check start/end time of meetings
  if (isPropertyChanged(oldMeeting, newMeeting, 'startTime') || isPropertyChanged(oldMeeting, newMeeting, 'endTime')) {
    CalendarEvents.find({itemId: newMeeting._id}).forEach((event) => {
      _.extend(event, {
        startTime: newMeeting.startTime,
        endTime: newMeeting.endTime
      });
      Meteor.call('editCalendarEvent', event);
    });
  }

  // check accepted users count
  let oldAccepted = oldMeeting.accepted;
  let newAccepted = newMeeting.accepted;

  let changedUserId = HospoHero.misc.arrayDifference(oldMeeting.accepted, newMeeting.accepted)[0];
  if (changedUserId) {
    if (oldAccepted.length > newAccepted.length) {
      // the user was removed from meeting
      CalendarEvents.remove({itemId: newMeeting._id, userId: changedUserId});
    } else {
      let area = HospoHero.getCurrentArea(Meteor.userId());

      // the user was added to the meeting
      let event = {
        itemId: newMeeting._id,
        startTime: newMeeting.startTime,
        endTime: newMeeting.endTime,
        type: 'meeting',
        userId: changedUserId,
        locationId: area.locationId,
        areaId: area._id
      };

      Meteor.call('addCalendarEvent', event);
    }
  }
});

TaskList.after.update(function (userId, newTask) {
  let oldTask = this.previous;

  if (isPropertyChanged('dueDate', oldTask, newTask) || isPropertyChanged('duration', oldTask, newTask)) {
    CalendarEvents.find({itemId: newTask._id}).forEach((event) => {
      let taskStartTime = HospoHero.dateUtils.applyTimeToDate(newTask.dueDate, event.startTime);

      _.extend(event, {
        startTime: taskStartTime,
        endTime: moment(taskStartTime).add(newTask.duration, 'minutes').toDate()
      });
      Meteor.call('editCalendarEvent', event);
    });
  }
});