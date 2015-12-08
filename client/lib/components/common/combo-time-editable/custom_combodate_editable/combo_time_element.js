Template.comboTimeElement.onCreated(function () {

  var defaultMoment = moment(this.data.value);

  var hours = defaultMoment.hours();
  var ampm = hours > 11 ? 'pm' : 'am';
  hours = hours > 11 ? hours - 12 : hours;
  var minutes = defaultMoment.minutes();

  this.timeObject = {
    hours: hours,
    minutes: minutes,
    ampm: ampm
  }
});

Template.comboTimeElement.helpers({
  hours: function () {
    var hours = [];

    for (var i = 0; i < 12; i++) {
      var hour = {};
      hour.value = i;
      hour.selected = Template.instance().timeObject.hours == i ? 'selected' : '';

      hours.push(hour);
    }
    return hours;
  },
  minutes: function () {
    var minuteStepping = Template.instance().data.minuteStepping;
    var minutes = [];

    for (var i = 0; i < 60; i = i + minuteStepping || 1) {
      var minute = {};
      minute.value = i;
      minute.selected = Template.instance().timeObject.minutes == i ? 'selected' : '';

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
      item.selected = item.value == Template.instance().timeObject.ampm ? 'selected' : '';
      return item;
    });
  }
});