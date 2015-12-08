Template.userUnavailability.onCreated(function () {
  this.subscribe('allLeaveRequests');
  this.subscribe('userAllUnavailabilities');
});