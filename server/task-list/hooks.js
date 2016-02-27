TaskList.after.update(function (userId, newTask) {
  let oldTask = this.previous;

  if (oldTask.dueDate.valueOf() !== newTask.dueDate.valueOf() || oldTask.duration !== newTask.duration) {
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