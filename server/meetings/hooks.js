Meetings.after.update(function (userId, newMeeting) {
  let oldMeeting = this.previous;

  // check start/end time of meetings
  if (oldMeeting.startTime.valueOf() !== newMeeting.startTime.valueOf() ||
    oldMeeting.endTime.valueOf() !== newMeeting.endTime.valueOf()) {
    CalendarEventsManager.update(newMeeting._id, {
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime
    });
  }

  // check accepted users count
  let oldAccepted = oldMeeting.accepted;
  let newAccepted = newMeeting.accepted;

  let changedUserId = HospoHero.misc.arrayDifference(oldAccepted, newAccepted)[0];
  if (changedUserId) {
    if (oldAccepted.length > newAccepted.length) {
      // the user was removed from meeting
      CalendarEventsManager.remove({itemId: newMeeting._id, userId: changedUserId});
    } else {
      CalendarEventsManager.insert(newMeeting, 'meeting', changedUserId);
    }
  }
});