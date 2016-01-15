Template.unavailabiliiesDatepicker.onRendered(function () {
  var defaultDate = this.data.defaultDate || new Date();
  this.datepicker = this.$('.' + this.data.datepickerClass);

  this.datepicker.datepicker({
    format: 'dd/mm/yy',
    startDate: defaultDate,
    autoclose: true,
    todayHighlight: true
  });
  this.datepicker.datepicker('setDate', defaultDate);
});

Template.unavailabiliiesDatepicker.events({
  'click .open-datepicker': function () {
    var tmpl = Template.instance();
    tmpl.datepicker.datepicker('show');
  }
});