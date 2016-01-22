Meteor.methods({
  addShiftsToCalendar: function (usersAndShifts) {
    // Set job time to the shift time
    var adjustJobTime = function (oldTime, newTime) {
      newTime = moment(newTime);

      var adjustedMoment = moment(oldTime);
      adjustedMoment.hours(newTime.hours());
      adjustedMoment.minutes(newTime.minutes());

      return adjustedMoment;
    };

    if (_.keys(usersAndShifts).length) {

      _.each(usersAndShifts, function (shifts, userId) {
        shifts.forEach(function (shift) {

          if (shift.section) {
            // Find already placed jobs in the calendar
            var placedJobIds = CalendarEvents.find({
              date: TimeRangeQueryBuilder.forDay(shift.startTime, shift.relations.locationId),
              type: 'recurring job'
            }).map(function (job) {
              return job._id;
            });

            var eventObject = {
              type: 'recurring job',
              userId: userId,
              date: shift.startTime,
              locationId: shift.relations.locationId
            };

            JobItems.find({
              _id: { $nin: placedJobIds },
              section: shift.section
            }).forEach(function (job) {
              var jobStartTime = adjustJobTime(job.repeatAt, shift.startTime);

              var jobEventObject = _.extend({
                itemId: job._id,
                startTime: moment(jobStartTime).toDate(),
                endTime: moment(jobStartTime).add(job.activeTime, 'seconds').toDate()
              }, eventObject);

              Meteor.call('addCalendarEvent', jobEventObject);
            });
          }
        });
      })
    }
  },

  addCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventChecker);
    CalendarEvents.insert(eventObject);
  },

  editCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventChecker);
    CalendarEvents.update({_id: eventObject._id}, {$set: eventObject});
  },

  removeCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventChecker);
    CalendarEvents.remove({_id: eventObject._id});
  }
});