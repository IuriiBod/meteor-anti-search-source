Namespace('HospoHero.dateUtils', {
  /**
   * Convert date to the necessary timezone and format
   * @param {String | Object} date - date string or Date object
   * @param {String} dateFormat - moment format of output date
   * @param {String} locationId - ID of location (get timezone from this location)
   * @returns {String}
   */
  formatDateWithTimezone: function (date, dateFormat, locationId) {
    return HospoHero.dateUtils.getDateMomentForLocation(date, locationId).format(dateFormat);
  },

  /**
   * Returns moment for specified date in timezone for specified location
   * @param date
   * @param locationId
   * @returns {*}
   */
  getDateMomentForLocation: function (date, locationId) {
    var location = Locations.findOne({_id: locationId}, {fields: {timezone: 1}});
    return moment(date).tz(location.timezone);
  },

  formatDate: function (date, format) {
    return moment(date).format(format);
  },

  shortDateFormat: function (date) {
    return moment(date).format('YYYY-MM-DD');
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

  shiftDateInterval: function (shift) {
    var dayFormat = 'ddd, Do MMMM';
    var timeFormat = 'h:mm A';

    var locationId = shift.relations.locationId;

    var day = HospoHero.dateUtils.formatDateWithTimezone(shift.startTime, dayFormat, locationId);
    var startTime = HospoHero.dateUtils.formatDateWithTimezone(shift.startTime, timeFormat, locationId);
    var endTime = HospoHero.dateUtils.formatDateWithTimezone(shift.endTime, timeFormat, locationId);

    return day + ' ' + startTime + ' - ' + endTime;
  },

  timeFormat: function (date, locationId) {
    var dateFormat = 'h:mm A';
    if (locationId && _.isString(locationId)) {
      return HospoHero.dateUtils.formatDateWithTimezone(date, dateFormat, locationId);
    } else {
      return HospoHero.dateUtils.formatDate(date, dateFormat);
    }
  },

  shiftDate: function (date, isTemplate) {
    date = date ? date : moment().startOf('d');

    var dateMoment;
    if (isTemplate) {
      dateMoment = moment(0).week(2).startOf('isoweek').day(moment(date).day()); //1970 year
    } else {
      dateMoment = moment(date);
    }

    //be careful, because this method may bring bug with time
    return dateMoment.toDate();
  },

  /**
   * Ensures that all shift times have the same date
   *
   * @param updatedShift shift to adjust
   */
  adjustShiftTimes: function (updatedShift) {
    // Returns new valid time based on shift's date
    var shiftTime = function (time) {
      var timeMoment = moment(time);
      return moment(updatedShift.shiftDate).hours(timeMoment.hours()).minutes(timeMoment.minutes()).toDate();
    };

    ['startTime', 'endTime'].forEach(function (propertyName) {
      updatedShift[propertyName] = shiftTime(updatedShift[propertyName])
    });
  },

  getDateByWeekDate: function (weekDate) {
    return moment(weekDate.year, 'YYYY').week(weekDate.week).startOf('isoweek').toDate();
  },

  getWeekDays: function (weekDate) {
    var weekStart = moment(this.getDateByWeekDate(weekDate));
    var weekDays = [];
    for (var i = 0; i < 7; i++) {
      weekDays.push(new Date(weekStart.toDate()));
      weekStart.add(1, 'day');
    }
    return weekDays;
  },

  getWeekStartEnd: function (week, year) {
    if (!year) {
      year = moment().year()
    }
    return {
      monday: moment().year(year).week(week).startOf("isoWeek").toDate(),
      sunday: moment().year(year).week(week).endOf("isoWeek").toDate()
    }
  },

  weekDateName: function (date) {
    return moment(date).format('dddd');
  },

  dateFormat: function (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
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

  // This method also aren't used
  timeDuration: function (time) {
    var hours = moment.duration(time).hours();
    var mins = moment.duration(time).minutes();

    var timeFormat = function (value, name) {
      if (value > 0) {
        var result = value + ' ' + name;
        return value == 1 ? result : result + 's';
      } else {
        return '';
      }
    };

    var durationText = timeFormat(hours, 'hour') + ' ' + timeFormat(mins, 'minute');
    return durationText.trim();
  },

  //Formatted time with Ago
  timeFromNow: function (time) {
    return moment(time).fromNow();
  }
});