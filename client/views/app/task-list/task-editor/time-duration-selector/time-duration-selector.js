Template.timeDurationSelector.onRendered(function () {
  this.$('.time-duration-popover').popover({
    placement: 'left',
    content: 'e.g: 2 hours 15 minutes, 1h 30m, 45 min'
  });
});


Template.timeDurationSelector.helpers({
  getTaskDuration: function () {
    var getHoursFromDuration = function (durationInMinutes) {
      var hours = parseInt(durationInMinutes / 60);
      var hoursText = hours % 10 === 1 ? 'hour' : 'hours';
      return hours + ' ' + hoursText;
    };

    var getMinutesFromDuration = function (durationInMinutes) {
      var minutes = durationInMinutes % 60;
      if (minutes > 0) {
        var minutesText = minutes === 1 ? 'minute' : 'minutes';
        return minutes + ' ' + minutesText;
      } else {
        return '';
      }
    };

    if (!this.duration) {
      return '';
    } else {
      var duration = this.duration;
      var durationString = [];

      if (duration >= 60) {
        durationString.push(getHoursFromDuration(duration));
      }
      durationString.push(getMinutesFromDuration(duration));
      return durationString.join(' ').trim();
    }
  }
});