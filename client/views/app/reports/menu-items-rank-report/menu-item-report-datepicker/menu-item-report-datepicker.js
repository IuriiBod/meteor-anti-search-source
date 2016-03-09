Template.menuItemReportDatepicker.onRendered(function () {
  var datePicker = this.$('#sandbox-container #datepicker');

  datePicker.datepicker({
    format: 'yyyy-mm-dd'
  });

  if (this.data.rangeType === 'custom-range') {
    datePicker.find('[name=start]').val(this.data.startDate);
    datePicker.find('[name=end]').val(this.data.endDate);
  }
});

Template.menuItemReportDatepicker.events({
  'change #datepicker input': function (event, tmpl) {
    event.preventDefault();
    var startDate = tmpl.$('.input-daterange input[name=start]').val();
    var endDate = tmpl.$('.input-daterange input[name=end]').val();

    if (startDate && endDate && startDate < endDate) {
      Router.go('menuItemsRankReport', {
        category: tmpl.data.selectedCategoryId,
        rangeType: 'custom-range',
        startDate: startDate,
        endDate: endDate
      });
    }
  }
});