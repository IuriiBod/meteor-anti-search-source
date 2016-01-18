Template.timeDurationSelector.onRendered(function () {
  this.$('.time-duration-popover').popover({
    placement: 'left',
    content: 'e.g: 2 hours 15 minutes, 1h 30m, 45 min'
  });
});


Template.timeDurationSelector.helpers({
  getTaskDuration: function () {
    if (!this.duration) {
      return '';
    } else {
      var duration = this.duration;
      var durationString = [];

      if (duration >= 60) {
        var hours = parseInt(duration / 60);
        var hoursText = hours % 10 === 1 ? 'hour' : 'hours';
        durationString.push(hours + ' ' + hoursText);
      }
      var minutes = duration % 60;
      if (minutes > 0) {
        var minutesText = minutes === 1 ? 'minute' : 'minutes';
        durationString.push(minutes + ' ' + minutesText);
      }
      return durationString.join(' ');
    }
  }
});