Meteor.methods({
  /**
   * Finds recurring jobs from shifts and place it onto user's calendar
   * @param {string} userId - ID of user
   * @param {Date} date - the date of shift
   * @param {string} locationId - ID of location
   */
  addJobsToCalendar: function (userId, date, locationId) {
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
     * Checks if the job can be placed for current date
     * @param {Object} job - job to check
     * @param {moment} dateMoment - moment object for interested date
     * @returns {boolean}
     */
    var isJobActiveToday = function (job, dateMoment) {
      if (job.frequency === 'weekly') {
        // check if the repeating weekday is equal to the shift date
        var shiftWeekday = moment(dateMoment).format('ddd');
        if (job.repeatOn.indexOf(shiftWeekday) === -1) {
          return false;
        }
      } else if (job.frequency === 'everyXWeeks') {
        // check if the repeating week is equal to the shift date
        if (diffDates(dateMoment, job.startsOn, 'weeks') % job.repeatEvery !== 0) {
          return false;
        }
      }
      return true;
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
      adjustTime.date(newTime.date());

      return adjustTime;
    };

    var interestedTimeRange = TimeRangeQueryBuilder.forDay(date, locationId);

    // find all shifts in all areas for current user for interested date
    var shifts = Shifts.find({
      assignedTo: userId,
      startTime: interestedTimeRange,
      published: true
    });

    shifts.forEach(function (shift) {

      if (shift.section) {
        var shiftTime = shift.startTime;

        var defaultEventObject = {
          type: 'recurring job',
          userId: userId,
          date: shiftTime,
          locationId: shift.relations.locationId
        };

        //Remove jobs already placed in the calendar
        CalendarEvents.remove({
          userId: userId,
          date: interestedTimeRange,
          type: 'recurring job'
        });

        var notPlacedJobs = JobItems.find({
          startsOn: {
            $lte: shiftTime
          },
          $or: [
            {'endsOn.on': 'endsNever'},
            {'endsOn.lastDate': {$gte: shiftTime}}
          ],
          section: shift.section
        });

        // Place found jobs into the calendar
        notPlacedJobs.forEach(function (job) {
          if (isJobEnded(job, shiftTime)) {
            return false;
          } else {
            var shiftMoment = moment(shiftTime);

            if (!isJobActiveToday(job, shiftMoment)) {
              return false;
            }

            var jobStartTime = adjustJobTime(job.repeatAt, shiftTime);
            var jobEndTime = moment(jobStartTime).add(job.activeTime, 'seconds');

            // check if the job start time is less than shift start time
            // and the job end time grater than shift end time
            if (jobStartTime.isBefore(shiftMoment) || jobEndTime.isAfter(shift.endTime)) {
              return false;
            }

            var jobEventObject = _.extend({
              itemId: job._id,
              startTime: jobStartTime.toDate(),
              endTime: jobEndTime.toDate()
            }, defaultEventObject);

            Meteor.call('addCalendarEvent', jobEventObject);
          }
        });
      }
    });
  },

  addCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!HospoHero.canUser('edit calendar', Meteor.userId())) {
      logger.error("User not permitted to add items onto calendar");
      throw new Meteor.Error(403, "User not permitted to add items onto calendar");
    } else {
      CalendarEvents.insert(eventObject);
    }
  },

  editCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!HospoHero.canUser('view calendar', Meteor.userId())) {
      logger.error("User not permitted to edit calendar items");
      throw new Meteor.Error(403, "User not permitted to edit calendar items");
    } else {
      CalendarEvents.update({_id: eventObject._id}, {$set: eventObject});
    }
  },

  removeCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!HospoHero.canUser('edit calendar', Meteor.userId())) {
      logger.error("User not permitted to delete items from calendar");
      throw new Meteor.Error(403, "User not permitted to delete items from calendar");
    } else {
      CalendarEvents.remove({_id: eventObject._id});
    }
  }
});