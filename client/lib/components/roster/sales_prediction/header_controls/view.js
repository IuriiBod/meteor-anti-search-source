Template.salesPredictionHeader.onRendered(function () {
  this.$('.datepicker').datepicker({
    format: "yyyy-mm-dd"
  });
});

Template.salesPredictionHeader.events({
  'changeDate .datepicker': function (event, tmpl) {
    var date = tmpl.$('.datepicker').datepicker('getDate');
    var formattedDate = moment(date).format('YYYY-MM-DD');
    Router.go('salesPrediction', {date: formattedDate});
  }
});