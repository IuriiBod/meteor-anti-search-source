Namespace('HospoHero.dateUtils', {
  formatDate: function (date, format) {
    return moment(date).format(format);
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

  intervalDateFormat: function (startDate, endDate) {
    var dayFormat = 'YYYY-MM-DD';
    var timeFormat = 'H:mm';
    var resultDate = [];

    startDate = moment(startDate);
    endDate = moment(endDate);

    var startDay = HospoHero.dateUtils.formatDate(startDate, dayFormat);
    var startTime = HospoHero.dateUtils.formatDate(startDate, timeFormat);

    var endDay = HospoHero.dateUtils.formatDate(endDate, dayFormat);
    var endTime = HospoHero.dateUtils.formatDate(endDate, timeFormat);

    resultDate.push(startDay + ' ' + startTime + ' - ');
    if (startDay != endDay) {
      resultDate.push(endDay);
    }
    resultDate.push(endTime);
    return resultDate.join('');
  },

  timeFormat: function (date) {
    return HospoHero.dateUtils.formatDate(date, 'H:mm');
  },

  shiftDate: function (date, isTemplate) {
    date = date ? date : new Date();

    var dateMoment;
    if (isTemplate) {
      dateMoment = moment(0).week(2).startOf('isoweek').day(moment(date).day()); //1970 year
    } else {
      dateMoment = moment(date);
    }

    //be careful, because this method may bring bug with time
    return dateMoment.toDate();
  }
});