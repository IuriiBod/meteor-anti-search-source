Namespace('HospoHero.dateUtils', {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },

  shortDateFormat: function (date) {
    return moment(date).format('YYYY-MM-DD');
  },

  timezones: function () {
    var zones = [];
    for (var i = -12; i <= 12; i++) {
      if (i > 0) {
        i = "+" + i;
      }
      zones.push({
        value: 'UTC ' + i,
        text: 'UTC ' + i
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

    //todo: add startedAt and finishedAt after converting them to Date type

    ['startTime', 'endTime'].forEach(function (propertyName) {
      updatedShift[propertyName] = shiftTime(updatedShift[propertyName])
    });
  },

  //todo: temporal method remove after converting finishedAt,startedAt
  adjustShiftUnixTimes: function (updatedShift) {
    // Returns new valid time based on shift's date
    var shiftTime = function (time) {
      var timeMoment = moment(time);
      return moment(updatedShift.shiftDate).hours(timeMoment.hours()).minutes(timeMoment.minutes()).toDate().getTime();
    };

    ['finishedAt', 'startedAt'].forEach(function (propertyName) {
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