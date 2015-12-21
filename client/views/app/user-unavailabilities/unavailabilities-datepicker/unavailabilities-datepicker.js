Template.unavailabiliiesDatepicker.onRendered(function () {
  this.dateFormat = 'DD/MM/YY';
  this.defaultDate = this.data.defaultDate || moment();

  this.$('.' + this.data.datepickerClass).datetimepicker({
    format: this.dateFormat,
    minDate: this.defaultDate,
    defaultDate: this.defaultDate
  });
});