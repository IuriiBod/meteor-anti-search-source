Router.route('viewLeaveRequest', {
    path: '/leaveRequests/:id',
    template: 'leaveRequestMainView',
    data: function () {
        return {
            leaveRequestId: this.params.id
        }
    }
});