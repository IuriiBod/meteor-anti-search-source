Router.route('viewLeaveRequest', {
  path: '/leaveRequests/:id',
  template: 'leaveRequestMainView',
  waitOn: function () {
    return Meteor.subscribe('leaveRequest', this.params.id);
  },
  data: function () {
    return {
      leaveRequestId: this.params.id
    }
  }
});