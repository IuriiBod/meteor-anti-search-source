Template.salesPrediction.onCreated(function () {
  FlowComponents.callAction('subsctibeOnMenuItems', this);
});

Template.salesPrediction.helpers({
  formatDate: function (date) {
    return moment(date).format('YYYY-MM-DD');
  },

  getDayOfWeek: function (date) {
    return moment(date).format('dddd');
  }
});

Template.salesPrediction.events({
  'click #loadMoreBtn': function () {
    FlowComponents.callAction('loadMoreMenuItems');
  }
});
