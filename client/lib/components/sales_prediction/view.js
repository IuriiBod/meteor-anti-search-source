Template.salesPrediction.helpers({
  formatDate: function (date) {
    return moment(date).format('YYYY-MM-DD');
  },

  getDayOfWeek: function (date) {
    return moment(date).format('dddd');
  },
  'getMenuItems': function () {
    return FlowComponents.callAction("getData")._result
  }
});

Template.salesPrediction.events({
  'click #loadMoreBtn': function (event) {
    event.preventDefault();
    var text = $("#searchMenuItems").val().trim();
    FlowComponents.callAction("loadMoreBtnClick", text);
  }
});