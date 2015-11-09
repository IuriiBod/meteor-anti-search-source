Namespace('HospoHero.dateUtils', {
  formatDate: function (date, format) {
    date = HospoHero.dateUtils.getTimeWithTimezone(null, date);
    return date.format(format);
  },

  shortDateFormat: function (date) {
    date = HospoHero.dateUtils.getTimeWithTimezone(null, date);
    return moment(date).format('YYYY-MM-DD');
  },

  timezones: function () {
    var zones = [];
    for (var i = -12; i <= 12; i++) {
      var text = 'UTC ';
      text += i > 0 ? '+' + i : i;

      zones.push({
        value: i,
        text: text
      });
    }
    return zones;
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

    var day = HospoHero.dateUtils.formatDate(shift.shiftDate, dayFormat);
    var startTime = HospoHero.dateUtils.formatDate(shift.startTime, timeFormat);
    var endTime = HospoHero.dateUtils.formatDate(shift.endTime, timeFormat);

    return day + ' ' + startTime + ' - ' + endTime;
  },

  timeFormat: function (date) {
    return HospoHero.dateUtils.formatDate(date, 'h:mm A');
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
    date = HospoHero.dateUtils.getTimeWithTimezone(null, date);
    return moment(date).format('dddd');
  },

  dateFormat: function (date) {
    if(date) {
      date = HospoHero.dateUtils.getTimeWithTimezone(null, date);
      return moment(date).format('YYYY-MM-DD');
    } else {
      return '-';
    }
  },

  fullDateFormat: function (date) {
    date = HospoHero.dateUtils.getTimeWithTimezone(null, date);
    return moment(date).format("DD/MM/YY hh:mm a");
  },

  dayFormat: function (date) {
    if(date) {
      date = HospoHero.dateUtils.getTimeWithTimezone(null, date);
      return moment(date).format('ddd, Do MMMM');
    } else {
      return '-';
    }
  },

  timeFormattedWithDate: function (time) {
    if(time) {
      time = HospoHero.dateUtils.getTimeWithTimezone(null, time);
      return moment(time).format('MMMM Do YYYY, h:mm:ss a');
    } else {
      return '-';
    }
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
  },

  /**
   * Return date respectively to preset timezone
   *
   * @param {String} locationIdOrTimezone - location ID or timezone (from -12 to 12)
   * @param {Date|String|null} date - date to process. If null - uses current date
   * @returns {Object} Moment object of date in passed timezone
   */
  getTimeWithTimezone: function(locationIdOrTimezone, date) {
    // If locationIdOrTimezone is null, try to get current location ID
    locationIdOrTimezone = locationIdOrTimezone ? locationIdOrTimezone : currentLocationId();

    // If length greater than 2, we've got probably MongoId
    var timezoneOffset = locationIdOrTimezone.length > 2 ?
      getTimezoneOffsetFromLocation(locationIdOrTimezone) : timezoneToTimezoneOffset(locationIdOrTimezone);

    var dateToProcess = !date ? moment() : moment(date);
    return dateToProcess.utcOffset(timezoneOffset);
  }
});

var getTimezoneOffsetFromLocation = function(locationId) {
  var location = Locations.findOne({_id: locationId});
  return location.timezone ? timezoneToTimezoneOffset(location.timezone) : moment().utcOffset();
};

var timezoneToTimezoneOffset = function(timezone) {
  return timezone * 60;
};

var currentLocationId = function() {
  var area = HospoHero.getCurrentArea();
  return area ? area.locationId : false;
};