Template.timeDurationSelector.onRendered(function () {
  this.$('.time-duration-popover').popover({
    placement: 'left',
    content: 'e.g: 2 hours 15 minutes, 1h 30m, 45 min'
  });
});


Template.timeDurationSelector.helpers({
  getTaskDuration: function () {
    return HospoHero.dateUtils.humanizeTimeDuration(this.duration);
  }
});