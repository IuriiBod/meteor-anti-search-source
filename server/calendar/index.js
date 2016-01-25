Meteor.methods({
  addShiftsToCalendar: function (usersAndShifts) {
    /**
     * Returns different between two moments
     * @param {Date|moment} firstDate - date or moment
     * @param {Date|moment} secondDate - date or moment
     * @param {String} dateUnits - the date units to count difference (days, weeks...)
     * @returns {number}
     */
    var diffDates = function (firstDate, secondDate, dateUnits) {
      return Math.abs(moment(firstDate).diff(moment(secondDate), dateUnits));
    };

    /**
     * Checks is the job already ended
     * @param {Object} job - the recurring job item object
     * @param {Date} shiftTime - the date of shift
     * @returns {boolean}
     */
    var isJobEnded = function (job, shiftTime) {
      if (job.endsOn && job.endsOn.after) {
        var jobStarts = job.startsOn;
        var endsAfter = job.endsOn.after;

        var frequencies = {
          daily: function () {
            return diffDates(shiftTime, jobStarts, 'days');
          },
          weekly: function () {
            return diffDates(shiftTime, jobStarts, 'weeks');
          },
          everyXWeeks: function () {
            return Math.floor(diffDates(shiftTime, jobStarts, 'weeks')) / job.repeatEvery;
          }
        };

        if (frequencies.hasOwnProperty(job.frequency)) {
          return frequencies[job.frequency]() <= endsAfter;
        } else {
          return true;
        }
      } else {
        return false;
      }
    };

    /**
     * Set job year, month and day to the shift time
     * @param {Date} oldTime - job date
     * @param {Date} newTime - shiftDate
     */
    var adjustJobTime = function (oldTime, newTime) {
      newTime = moment(newTime);

      var adjustTime = moment(oldTime);
      adjustTime.year(newTime.year());
      adjustTime.month(newTime.month());
      adjustTime.day(newTime.day());

      return adjustTime;
    };


    if (_.keys(usersAndShifts).length) {

      _.each(usersAndShifts, function (shifts, userId) {
        shifts.forEach(function (shift) {

          if (shift.section) {
            var shiftTime = HospoHero.dateUtils.getDateMomentForLocation(
              shift.startTime, shift.relations.locationId).toDate();

            var defaultEventObject = {
              type: 'recurring job',
              userId: userId,
              date: shiftTime,
              locationId: shift.relations.locationId
            };

            // Find already placed jobs in the calendar
            var placedJobIds = CalendarEvents.find({
              userId: userId,
              date: TimeRangeQueryBuilder.forDay(shiftTime),
              type: 'recurring job'
            }).map(function (event) {
              return event.itemId;
            });

            JobItems.find({
              _id: { $nin: placedJobIds },
              startsOn: {
                $lte: shiftTime
              },
              $or: [
                {'endsOn.on': 'endsNever'},
                {'endsOn.lastDate': { $gte: shiftTime }}
              ],
              section: shift.section
            }).forEach(function (job) {
              if (isJobEnded(job, shiftTime)) {
                return false;
              } else {
                var shiftMoment = moment(shiftTime);

                if (job.frequency === 'weekly') {
                  var shiftWeekday = moment(shiftMoment).format('ddd');
                  if (job.repeatOn.indexOf(shiftWeekday) > -1) {
                    return false;
                  }
                } else if (job.frequency === 'everyXWeeks') {
                  if (diffDates(shiftMoment, job.startsOn, 'weeks') % job.repeatEvery !== 0) {
                    return false;
                  }
                }

                var jobStartTime = adjustJobTime(job.repeatAt, shiftTime);

                var jobEventObject = _.extend({
                  itemId: job._id,
                  startTime: moment(jobStartTime).toDate(),
                  endTime: moment(jobStartTime).add(job.activeTime, 'seconds').toDate()
                }, defaultEventObject);

                Meteor.call('addCalendarEvent', jobEventObject);
              }
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