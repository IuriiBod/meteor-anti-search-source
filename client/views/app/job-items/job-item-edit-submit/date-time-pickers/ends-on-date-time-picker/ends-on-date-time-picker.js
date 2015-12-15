Template.endsOnDateTimePicker.onRendered(function () {
  this.$('.ends-on-date-picker').datetimepicker({
    format: 'YYYY-MM-DD'
  });
});