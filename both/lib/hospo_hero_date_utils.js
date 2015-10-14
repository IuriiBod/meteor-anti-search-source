Namespace('HospoHero.dateUtils', {
  hours: function() {
    var hours = [];
    for (var i = 0; i < 24; i++) {
      hours.push({
        value: i,
        text: i
      });
    }
    return hours;
  },

  formatDate: function(date, format) {
    return moment(date).format(format);
  },

  intervalDateFormat: function(startDate, endDate) {
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
    if(startDay != endDay) {
      resultDate.push(endDay);
    }
    resultDate.push(endTime);
    return resultDate.join('');
  }
});