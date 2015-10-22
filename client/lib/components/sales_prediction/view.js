Template.salesPrediction.onCreated(function () {
});

Template.salesPrediction.helpers({
  formatDate: function (date) {
    return moment(date).format('YYYY-MM-DD');
  },

  getDayOfWeek: function (date) {
    return moment(date).format('dddd');
  }
});
