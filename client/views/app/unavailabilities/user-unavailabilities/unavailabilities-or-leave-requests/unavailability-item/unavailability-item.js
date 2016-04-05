Template.unavailabilityItem.helpers({
  date: function () {
    return HospoHero.dateUtils.dayFormat(this.item.startDate);
  },
  isAllDay: function () {
    return this.item.isAllDay;
  },
  time: function () {
    return {
      startTime: HospoHero.dateUtils.timeFormat(this.item.startDate),
      endTime: HospoHero.dateUtils.timeFormat(this.item.endDate)
    };
  },
  comment: function () {
    return this.item.comment || false;
  },
  repeat: function () {
    var repeat = this.item.repeat;
    return repeat === 'weekly' ? 'week' : repeat === 'monthly' ? 'month' : false;
  }
});

Template.unavailabilityItem.events({
  'click .remove-unavailability-button': function (event, tmpl) {
    Meteor.call('removeUnavailability', tmpl.data.item._id, HospoHero.handleMethodResult());
  }
});