Template.userUnavailability.onCreated(function () {
  this.subscribe('userAllLeaveRequests');
  this.subscribe('userAllUnavailabilities');
});