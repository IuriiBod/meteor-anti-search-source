Namespace('HospoHero.dateUtils', {
  /**
   * @param {string|object} [location=currentLocationId] location document or it's ID
   * @returns {String}
   */
  getLocationTimeZone: function (location) {
    if (!location) {
      let currentArea = HospoHero.getCurrentArea(Meteor.userId());
      location = currentArea.locationId;
    }

    if (location && _.isString(location)) {
      location = Locations.findOne({_id: location}, {fields: {timezone: 1}});
    }

    return location.timezone;
  },

  /**
   * Convert date to the necessary timezone and format
   *
   * @param {String | Object} date - date string or Date object
   * @param {String} dateFormat - moment format of output date
   * @param {String} [locationId] - ID of location (get timezone from this location)
   * @returns {String}
   */
  formatDateWithTimezone: function (date, dateFormat, locationId) {
    return HospoHero.dateUtils.getDateMomentForLocation(date, locationId).format(dateFormat);
  },

  /**
   * Returns moment for specified date in timezone for specified location
   *
   * @param {date|*} date Date or moment
   * @param {string|object} [location=currentLocationId] location document or it's ID
   * @returns {moment.tz}
   */
  getDateMomentForLocation: function (date, location) {
    let timezone = HospoHero.dateUtils.getLocationTimeZone(location);
    return moment(new Date(date)).tz(timezone);
  },

  /**
   * @param {Date|moment} date basic date
   * @param {Date|moment} newTime time source
   * @returns {date}
   */
  applyTimeToDate: function (date, newTime) {
    // double moment constructor lets us to avoid bugs with initial date modification
    // because internal date is copied only with parameter of moment type
    let appliedDate = moment(moment(date));
    let timeMoment = moment(newTime);

    appliedDate.hours(timeMoment.hours());
    appliedDate.minutes(timeMoment.minutes());

    return appliedDate.toDate();
  },

  /**
   * Updates interval's start and end times
   *
   * Warning: Current implementation is working only
   * for intervals with duration less than 12 hours
   *
   * @param {date} date
   * @param {date} newStartTime
   * @param {date} newEndTime
   * @param {object | string} location
   */
  updateTimeInterval: function (date, newStartTime, newEndTime, location) {
    if (_.isString(location)) {
      location = Locations.findOne({_id: location}, {fields: {timezone: 1}});
    }

    date = HospoHero.dateUtils.formatDate(date || newStartTime, 'YYYY-MM-DDTHH:mm:ss');

    let dateIncludingTimezone = moment.tz(date, location.timezone);

    let newInterval = {
      start: HospoHero.dateUtils.applyTimeToDate(dateIncludingTimezone, newStartTime),
      end: HospoHero.dateUtils.applyTimeToDate(dateIncludingTimezone, newEndTime)
    };

    //in case start > end => we suppose interval should end after midnight
    if (moment(newInterval.start).isAfter(newInterval.end)) {
      newInterval.end = moment(newInterval.end).add(1, 'day').toDate();
    }

    return newInterval;
  },

  /**
   * Converts client local date to date considering
   * selected timezone (timezone takes from location)
   *
   * @param {date} date
   * @param {string} locationId
   */
  formatTimeToLocationTimezone(date, locationId) {
    let dateFormat = 'ddd MMM DD YYYY h:mm:ss a';
    let dateForTimeZone = HospoHero.dateUtils.formatDateWithTimezone(date, dateFormat, locationId);
    return new Date(dateForTimeZone);
  },

  hours: function () {
    var hours = [];
    for (var i = 0; i < 24; i++) {
      hours.push({
        value: i,
        text: i
      });
    }
    return hours;
  },

  minutes: function () {
    var minutes = [];
    for (var i = 0; i < 60; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minutes.push({
        value: i,
        text: i
      });
    }
    return minutes;
  },

  /**
   * * Converts the duration to the hours and minutes string
   * e.g. duration = 65, result will be 1h 5m
   * @param {number} duration - time duration
   * @param {string|'minutes'} timeUnit - the unit of duration measure (minutes, hours, ...)
   * @returns {string}
   */
  humanizeTimeDuration: function (duration, timeUnit = 'minutes') {
    duration = moment.duration(duration, timeUnit);

    var durationResult = [];
    var hours = duration.hours();
    var minutes = duration.minutes();

    if (hours > 0) {
      durationResult.push(hours + 'h');
    }

    if (minutes > 0) {
      durationResult.push(minutes + 'm');
    }

    return durationResult.length ? durationResult.join(' ') : '0m';
  },

  getWeekDays: function (weekDate) {
    var weekStart = moment(weekDate).startOf('isoWeek');
    var weekDays = [];
    for (var i = 0; i < 7; i++) {
      weekDays.push(new Date(weekStart.toDate()));
      weekStart.add(1, 'day');
    }
    return weekDays;
  },

  shiftDateInterval: function (shift) {
    var dayFormat = 'ddd, Do MMMM';
    var timeFormat = 'h:mm A';

    var locationId = shift.relations.locationId;

    var day = HospoHero.dateUtils.formatDateWithTimezone(shift.startTime, dayFormat, locationId);
    var startTime = HospoHero.dateUtils.formatDateWithTimezone(shift.startTime, timeFormat, locationId);
    var endTime = HospoHero.dateUtils.formatDateWithTimezone(shift.endTime, timeFormat, locationId);

    return day + ' ' + startTime + ' - ' + endTime;
  },

  startOfWeekMoment: function (date = moment(), location = false) {
    if (location) {
      date = HospoHero.dateUtils.getDateMomentForLocation(date, location);
    }
    return date.startOf('isoWeek');
  },

  getDateStringForRoute: function (date, location) {
    date = HospoHero.dateUtils.startOfWeekMoment(date, location);
    return HospoHero.dateUtils.shortDateFormat(date);
  },

  dateInterval: function (startTime, endTime) {
    var dayFormat = 'DD/MM/YY';
    var timeFormat = 'h:mm a';

    var day = HospoHero.dateUtils.formatDate(startTime, dayFormat);
    startTime = HospoHero.dateUtils.formatDate(startTime, timeFormat);
    endTime = HospoHero.dateUtils.formatDate(endTime, timeFormat);

    return day + ' ' + startTime + ' - ' + endTime;
  },

  //todo: move this method to global helpers
  formatDate: function (date, format) {
    return moment(date).format(format);
  },

  // everything below this comment is useless and should be removed!!!
  // https://trello.com/c/wbLph7j0/521-2-clean-up-hospohero-dateutils

  shortDateFormat: function (date = new Date()) {
    return moment(date).format('YYYY-MM-DD');
  },

  timeFormat: function (date) {
    return date ? moment(date).format('h:mm a') : '-';
  },

  weekDateName: function (date) {
    return moment(date).format('dddd');
  },

  dateFormat: function (date) {
    return date ? moment(new Date(date)).format('ddd DD/MM/YYYY') : '-';
  },

  fullDateFormat: function (date) {
    return moment(date).format("DD/MM/YY hh:mm a");
  },

  dayFormat: function (date) {
    return date ? moment(date).format('ddd, Do MMMM') : '-';
  },

  timeFormattedWithDate: function (time) {
    return time ? moment(time).format('MMMM Do YYYY, h:mm:ss a') : '-';
  },

  secondsToMinutes: function (secs) {
    return secs / 60;
  },

  truncateTimestamp: (timestamp = new Date().getTime()) => {
    return parseInt((timestamp).toString().substr(0, 10));
  },

  formatTimestamp: (timestamp = new Date().getTime()) => {
    return moment.unix(HospoHero.dateUtils.truncateTimestamp(timestamp)).format('DD/MM/YY');
  }
});