Template.expectedDeliveryDatePicker.onRendered(function () {
  //initialize date picker
  var datePickerElement = this.$(".date-picker-input");
  datePickerElement.datetimepicker({
    calendarWeeks: true,
    format: 'YYYY-MM-DD'
  });
  this.datePicker = datePickerElement.data("DateTimePicker");
  this.datePicker.date(moment(this.data.deliveryDate));
});


Template.expectedDeliveryDatePicker.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datePicker.toggle();
  },

  'dp.change .date-picker-input': function (event, tmpl) {
    var date = tmpl.datePicker.date().toDate();
    var receipt = tmpl.data.receipt;

    if (!moment(date).isSame(receipt.expectedDeliveryDate, 'day')) {
      var info = {
        expectedDeliveryDate: moment(date).startOf('day').valueOf(),
        version: receipt.version,
        supplier: receipt.supplierId
      };
      Meteor.call("updateReceipt", receipt._id, info, HospoHero.handleMethodResult());
    }
  }
});