CalendarEventsManager = function () {
};

/**
 * Returns different between two moments
 * @param {Date|moment} firstDate - date or moment
 * @param {Date|moment} secondDate - date or moment
 * @param {String} dateUnits - the date units to count difference (date, week~...)
 * @returns {number}
 */
CalendarEventsManager.prototype._diffDates = function (firstDate, secondDate, dateUnits) {
  return Math.abs(moment(firstDate)[dateUnits]() - moment(secondDate)[dateUnits]());
};

/**
 * Checks is the job already ended
 * @param {Object} job - the recurring job item object
 * @param {Date} shiftTime - the date of shift
 * @returns {boolean}
 */
CalendarEventsManager.prototype._isJobEnded = function (job, shiftTime) {
  if (job.endsOn && job.endsOn.after) {
    var jobStarts = job.startsOn;
    var endsAfter = job.endsOn.after;

    var self = this;
    var frequencies = {
      daily: function () {
        return self._diffDates(shiftTime, jobStarts, 'date');
      },
      weekly: function () {
        return self._diffDates(shiftTime, jobStarts, 'week');
      },
      everyXWeeks: function () {
        return Math.floor(diffDates(shiftTime, jobStarts, 'week')) / job.repeatEvery;
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
 * @param {Date} date - date object for interested date
 * @returns {boolean}
 */
CalendarEventsManager.prototype._isJobActiveToday = function (job, date) {
  if (job.frequency === 'weekly') {
    // check if the repeating weekday is equal to the shift date
    var shiftWeekday = moment(date).format('ddd');
    if (job.repeatOn.indexOf(shiftWeekday) === -1) {
      return false;
    }
  } else if (job.frequency === 'everyXWeeks') {
    // check if the repeating week is equal to the shift date
    if (this._diffDates(date, job.startsOn, 'week') % job.repeatEvery !== 0) {
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
CalendarEventsManager.prototype._adjustJobTime = function (oldTime, newTime) {
  newTime = moment(newTime);

  var adjustTime = moment(oldTime);
  adjustTime.year(newTime.year());
  adjustTime.month(newTime.month());
  adjustTime.date(newTime.date());

  return adjustTime;
};

/**
 * Checks if another job are already placed in this time interval
 * @param {Date|moment} jobStartTime
 * @param {Date|moment} jobEndTime
 * @returns {boolean}
 */
CalendarEventsManager.prototype._anotherJobExistsAtThisTime = function (jobStartTime, jobEndTime) {
  var jobStartEndInterval = TimeRangeQueryBuilder.forInterval(jobStartTime, jobEndTime);
  return !!CalendarEvents.findOne({
    $or: [
      {startTime: jobStartEndInterval},
      {endTime: jobStartEndInterval}
    ]
  });
};



/**
 * Finds recurring jobs from the shift and place it onto user's calendar
 * @param {Object} shift
 */
CalendarEventsManager.prototype.addJobsToCalendar = function (shift) {
  if (shift.section && shift.assignedTo) {
    var userId = shift.assignedTo;
    var locationId = shift.relations.locationId;
    var shiftTime = shift.startTime;
    var startOfDay = HospoHero.dateUtils.getDateMomentForLocation(shiftTime, locationId).startOf('day').toDate();

    var defaultEventObject = {
      type: 'recurring job',
      userId: userId,
      shiftId: shift._id,
      locationId: locationId
    };

    // Remove existed recurring job event for current shift.
    // Need to ensure that inserted event will have the last
    // version of job item and shift information
    CalendarEvents.remove({
      shiftId: shift._id,
      type: 'recurring job'
    });

    // find all placed jobs for other users
    var placedJobs = CalendarEvents.find({
      startTime: TimeRangeQueryBuilder.forDay(shiftTime, locationId),
      type: 'recurring job'
    }).map(function (event) {
      return event.itemId;
    });

    var notPlacedJobs = JobItems.find({
      _id: { $nin: placedJobs },
      startsOn: { $lte: startOfDay },
      $or: [
        {'endsOn.on': 'endsNever'},
        {'endsOn.lastDate': {$gte: startOfDay}}
      ],
      section: shift.section
    });

    var self = this;
    // Place found jobs into the calendar
    notPlacedJobs.forEach(function (job) {
      if (self._isJobEnded(job, shiftTime)) {
        return false;
      } else {
        if (!self._isJobActiveToday(job, shiftTime)) {
          return false;
        }

        var jobStartTime = self._adjustJobTime(job.repeatAt, shiftTime);
        var jobEndTime = moment(jobStartTime).add(job.activeTime, 'seconds');

        // check if the job start time is less than shift start time
        // and the job end time grater than shift end time
        if (jobStartTime.isBefore(shiftTime) || jobEndTime.isAfter(shift.endTime)) {
          return false;
        }

        if (self._anotherJobExistsAtThisTime(jobStartTime, jobEndTime)) {
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
};