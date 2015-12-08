Template.viewLeaveRequest.onCreated(function () {
  this.subscribe('leaveRequestsApprovers');

  this.getRequestValuesFromTemplate = function () {
    var startDate = this.$('.start-date-picker').data('DateTimePicker').date();
    var endDate = this.$('.end-date-picker').data('DateTimePicker').date();
    var notifyManagerId = this.$('.notify-manager-select').val() || '';
    var comment = this.$('.comment-input').val() || '';

    return {
      startDate: startDate,
      endDate: endDate,
      notifyManagerId: notifyManagerId,
      comment: comment
    }
  };
});

Template.viewLeaveRequest.onRendered(function () {
  var self = this;

  // Get a current flyout
  self.currentFlyout = FlyoutManager.getInstanceByElement(self.$('.view-leave-request'));

  // Define a dateTimePickers
  self.$('.start-date-picker').datetimepicker({
    format: 'YYYY MMM Do',
    minDate: moment(),
    defaultDate: moment()
  });
  self.$('.end-date-picker').datetimepicker({
    format: 'YYYY MMM Do',
    minDate: moment().add(1, 'day'),
    defaultDate: moment().add(1, 'day')
  });

  // Events for dateTimePicker
  // Set minDate for end-date-picker, that equals date of start-date-picker,
  // and change date on end-time-picker, if current date less than minDate
  self.$(".start-date-picker").on("dp.change", function (e) {
    var endDatePicker = self.$('.end-date-picker').data("DateTimePicker");
    endDatePicker.minDate(e.date.add(1, 'day'));

    if (endDatePicker.minDate() > endDatePicker.date()) {
      endDatePicker.date(endDatePicker.minDate());
    }
  });
});

Template.viewLeaveRequest.events({
  'submit .leave-request-form': function (e, tmpl) {
    e.preventDefault();

    var values = tmpl.getRequestValuesFromTemplate();

    FlowComponents.callAction('saveLeaveRequest', values, tmpl.currentFlyout);
  },
  'click .approve-button': function () {
    FlowComponents.callAction('approveLeaveRequest');
  },
  'click .decline-button': function () {
    FlowComponents.callAction('declineLeaveRequest');
  }
});