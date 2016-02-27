Shifts.after.update(function (userId, newShift) {
  var oldShift = this.previous;

  // when the assigned user was changed,
  // move old user's jobs to the new user
  if (newShift.assignedTo !== oldShift.assignedTo) {
    CalendarEventsManager.update(newShift._id, {
      userId: newShift.assignedTo
    });
  } else {
    CalendarEventsManager.remove({shiftId: newShift._id, type: 'recurring job'});
    CalendarRecurringJobsManager.addRecurringJobsToCalendar(newShift);
  }
});