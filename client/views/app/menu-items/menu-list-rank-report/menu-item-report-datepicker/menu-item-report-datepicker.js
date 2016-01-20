Template.menuItemReportDatepicker.onRendered(function () {
  this.$('#sandbox-container .input-daterange').datepicker({
    format: 'yyyy-mm-dd'
  });
});

Template.menuItemReportDatepicker.events({
  'change input': function (event, tmpl) {
    event.preventDefault();
    var startDate = tmpl.$('.input-daterange input[name=start]').val();
    var endDate = tmpl.$('.input-daterange input[name=end]').val();

    if (startDate && endDate) {
      Router.go('menuItemsReportByDateRange', {startDate: startDate, endDate: endDate});
    }
  }
});