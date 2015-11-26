/**
 * Scheduler built on top of synced cron job
 *
 */
var LocationScheduler = function () {
  this._isStarted = false;
  this._dailyJobs = [];

  SyncedCron.add({
    name: "Hourly locations' jobs",
    schedule: function (parser) {
      return parser.text('every 60 minutes');
    },
    job: this._cronHourlyJob.bind(this)
  });
};

/**
 * Executes all locations' jobs
 * @private
 */
LocationScheduler.prototype._cronHourlyJob = function () {
  var currentTime = new Date();
  var self = this;

  Locations.find({}).forEach(function (location) {
    var localMoment = HospoHero.dateUtils.getDateMomentForLocation(currentTime, location._id);

    var isSameHour = function (timeResult) {
      if (_.isNumber(timeResult)) {
        return localMoment.hour() === timeResult;
      } else {
        return localMoment.isSame(timeResult, 'hour');
      }
    };

    self._dailyJobs.forEach(function (jobEntry) {
      var timeResult = jobEntry.timeCallback(location);

      if (isSameHour(timeResult)) {
        jobEntry.jobCallback(location, localMoment);
      }
    });
  });
};

/**
 * Adds new scheduled job.
 * Callbacks will be called for each location every hour.
 * If result of `timeCallback` match with current local moment
 * then `jobCallback` will be executed.
 *
 * @param timeCallback receives location document and should return date
 * or hour (Number, 24 hour format) when job should be executed for specified location
 * @param jobCallback executes job itself, receives same parameters as `timeCallback`
 */
LocationScheduler.prototype.addDailyJob = function (timeCallback, jobCallback) {
  this._dailyJobs.push({
    timeCallback: timeCallback,
    jobCallback: jobCallback
  });
};

/**
 * Initialize job execution
 */
LocationScheduler.prototype.start = function () {
  if (!this._isStarted) {
    this._isStarted = true;
    SyncedCron.start();
  }
};


Namespace('HospoHero.LocationScheduler', new LocationScheduler());


