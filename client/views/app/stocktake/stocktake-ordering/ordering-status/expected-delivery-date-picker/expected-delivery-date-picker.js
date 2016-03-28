Template.expectedDeliveryDatePicker.onRendered(function () {
  //initialize date picker
  var datePickerElement = this.$(".date-picker-input");
  datePickerElement.datepicker({
    format: 'yyyy-mm-dd'
  });
  this.datePicker = datePickerElement;
  this.datePicker.datepicker('setDate', this.data.expectedDeliveryDate);
});


Template.expectedDeliveryDatePicker.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datePicker.datepicker('show');
  },

  'changeDate .date-picker-input': function (event, tmpl) {
    let date = event.date;
    let order = tmpl.data;

    if (!moment(date).isSame(order.expectedDeliveryDate, 'day')) {
      order.expectedDeliveryDate = moment(date).startOf('day').toDate();
      Meteor.call('updateOrder', order, HospoHero.handleMethodResult());
    }
  }
});