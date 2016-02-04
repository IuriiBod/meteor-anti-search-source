Template.reactiveDateTimePicker.onRendered(function () {
  this.$('.' + this.data.selector).datepicker({
    format: 'yyyy-mm-dd'
  });
});