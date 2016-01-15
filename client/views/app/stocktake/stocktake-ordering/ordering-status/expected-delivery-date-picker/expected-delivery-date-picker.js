Template.expectedDeliveryDatePicker.onRendered(function () {
  //initialize date picker
  var datePickerElement = this.$(".date-picker-input");
  datePickerElement.datepicker({
    calendarWeeks: true,
    format: 'yyyy-mm-dd',
    todayHighlight: true,
    weekStart: 1
  });
  this.datePicker = datePickerElement;
  this.datePicker.datepicker('setDate', this.data.deliveryDate);
});


Template.expectedDeliveryDatePicker.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datePicker.datepicker('show');
  },

  'changeDate .date-picker-input': function (event, tmpl) {
    var date = event.date;
    var receipt = tmpl.data.receipt;

    if (!moment(date).isSame(receipt.expectedDeliveryDate, 'day')) {
      var info = {
        expectedDeliveryDate: moment(date).startOf('day').valueOf(),
        version: receipt.version,
        supplier: receipt.supplierId
      };
      Meteor.call("updateReceipt", receipt._id, info, HospoHero.handleMethodResult(function () {
        tmpl.datePicker.datepicker('hide');
      }));
    }
  }
});