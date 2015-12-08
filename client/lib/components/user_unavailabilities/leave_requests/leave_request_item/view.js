Template.leaveRequestItem.events({
  'click .remove-leave-request-button': function () {
    FlowComponents.callAction('removeLeaveRequest');
  }
});