Template.leaveRequestItem.helpers({
  date: function () {
    var dateFormat = 'ddd D MMM';
    return {
      startDate: HospoHero.dateUtils.formatDate(this.item.startDate, dateFormat),
      endDate: HospoHero.dateUtils.formatDate(this.item.endDate, dateFormat)
    };
  },
  comment: function () {
    return this.item.comment || false;
  },
  status: function () {
    return this.item.status ? this.item.status.value : 'awaiting';
  }
});

Template.leaveRequestItem.events({
  'click .remove-leave-request-button': function (event, tmpl) {
    Meteor.call('removeLeaveRequest', tmpl.data.item._id);
  }
});