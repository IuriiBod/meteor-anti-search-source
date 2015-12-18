Router.route('viewLeaveRequest', {
  path: '/leaveRequests/:id',
  template: 'leaveRequestMainView',
  waitOn: function () {
    return Meteor.subscribe('leaveRequestById', this.params.id);
  },
  data: function () {
    return {
      leaveRequestId: this.params.id
    }
  }
});