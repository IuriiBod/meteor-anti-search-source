Template.reactiveDateTimePicker.onRendered(function () {
  this.$('.' + this.data.selector).datetimepicker({
    format: 'YYYY-MM-DD'
  });
});