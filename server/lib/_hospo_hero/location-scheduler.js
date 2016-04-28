/**
 * Scheduler built on top of synced cron job
 *
 */
class LocationScheduler {
  constructor() {
    this._isStarted = false;
    this._dailyJobs = [];

    SyncedCron.add({
      name: 'Hourly locations jobs',
      schedule: function (parser) {
        return parser.text('every 1 hour');
      },
      job: this._cronHourlyJob.bind(this)
    });
  }

  /**
   * Executes all locations' jobs
   * @private
   */
  _cronHourlyJob() {
    let currentTime = new Date();

    Locations.find({archived: {$ne: true}}).forEach(location => {
      let localMoment = HospoHero.dateUtils.getDateMomentForLocation(currentTime, location);

      let isSameHour = timeResult => {
        if (_.isNumber(timeResult)) {
          let localTimeResult = moment(localMoment).hours(timeResult);
          return localMoment.isSame(localTimeResult, 'hour');
        } else {
          return false;
        }
      };

      this._dailyJobs.forEach(jobEntry => {
        let timeResult = jobEntry.timeCallback(location);

        if (isSameHour(timeResult)) {
          Meteor.defer(() => {
            logger.info('[scheduler] Location job: ' + jobEntry.description, {
              locationId: location._id,
              localTime: localMoment.format('YYYY-MM-DD HH:mm')
            });

            jobEntry.jobCallback(location, localMoment);
          });
        }
      });
    });
  }

  /**
   * Adds new scheduled job.
   * Callbacks will be called for each location every hour.
   * If result of `timeCallback` match with current local moment
   * then `jobCallback` will be executed.
   *
   * @param {string} jobDescription
   * @param {function} timeCallback receives location document and should return
   * hour (Number, 24 hour format) when job should be executed for specified location
   * @param {function} jobCallback executes job itself, receives same parameters as `timeCallback`
   */
  addDailyJob(jobDescription, timeCallback, jobCallback) {
    this._dailyJobs.push({
      description: jobDescription,
      timeCallback: timeCallback,
      jobCallback: jobCallback
    });
  }

  /**
   * Initialize job execution
   */
  start() {
    if (!this._isStarted) {
      this._isStarted = true;
      SyncedCron.start();
    }
  }
}


Namespace('HospoHero.LocationScheduler', new LocationScheduler());