Router.route('viewLeaveRequest', {
  path: '/leaveRequests/:id',
  template: 'leaveRequestMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return Meteor.subscribe('leaveRequest',currentAreaId, this.params.id);
  },
  data: function () {
    return {
      leaveRequest: LeaveRequests.findOne({_id: this.params.id})
    };
  }
});