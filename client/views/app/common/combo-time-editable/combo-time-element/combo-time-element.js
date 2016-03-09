Template.comboTimeElement.onCreated(function () {
  /**
   * Round decimal number to the nearest number with persistence
   * 47 -> 45, 48 -> 50
   * @param numberToRound
   * @param persistence
   */
  this.roundToNearestNumber = function (numberToRound, persistence) {
    // get the division remainder (47 % 50 = 2)
    var remainder = numberToRound % persistence;

    // get the sign of round operation (2 / 5 ~ 0; 3 / 5 ~ 1)
    // if 0 - the sign of operation will be -; otherwise +
    var roundingSign = Math.round(remainder / persistence);
    return roundingSign ? numberToRound + persistence - remainder : numberToRound - remainder;
  };

  var defaultMoment = _.isDate(this.data.value) ? moment(this.data.value) : moment();
  var hours = moment(defaultMoment).format('h');
  var ampm = moment(defaultMoment).format('a');
  var minutes = moment(defaultMoment).minutes();

  var minuteStepping = this.data.minuteStepping || 1;
  var minutesRounded = this.roundToNearestNumber(minutes, minuteStepping);

  // Need for correct minutes rounding (if it was 57 minutes and it was rounded to the 60, we must add 1 hour too)
  var hoursFixer = minutes !== 0 && minutesRounded === 60 ? 1 : 0;
  hours = parseInt(hours) + hoursFixer;

  this.timeObject = {
    hours: hours,
    minutes: minutesRounded,
    ampm: ampm
  };
});

Template.comboTimeElement.helpers({
  hours: function () {
    var hours = [];

    for (var i = 1; i <= 12; i++) {
      var hour = {};
      hour.value = i;
      hour.selected = Template.instance().timeObject.hours === i ? 'selected' : '';

      hours.push(hour);
    }
    return hours;
  },
  minutes: function () {
    var minuteStepping = Template.instance().data.minuteStepping;
    var minutes = [];

    for (var i = 0; i < 60; i = i + minuteStepping || 1) {
      var minute = {};
      minute.value = i < 10 ? '0' + i : i;
      minute.selected = Template.instance().timeObject.minutes === i ? 'selected' : '';

      minutes.push(minute);
    }
    return minutes;
  },
  ampm: function () {
    var ampm = [{
      value: 'am',
      title: 'AM'
    }, {
      value: 'pm',
      title: 'PM'
    }];

    return _.map(ampm, function (item) {
      item.selected = item.value === Template.instance().timeObject.ampm ? 'selected' : '';
      return item;
    });
  }
});