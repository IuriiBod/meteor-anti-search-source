Router.route('userUnavailability', {
    path: '/unavailabilities',
    template: 'userUnavailabilityMainView',
    waitOn: function () {
        Meteor.subscribe('userAllUnavailabilities');
        Meteor.subscribe('userAllLeaveRequests');
    },
    data: {
        isUnavailablesList: true
    }
});

Router.route('addNewUnavailability', {
    path: '/unavailabilities/new',
    template: 'userUnavailabilityMainView',
    data: {
        isAddNewUnavailable: true
    }
});

Router.route('addNewLeaveRequest', {
    path: '/leaveRequests/newLeaveRequest',
    template: 'userUnavailabilityMainView',
    data: {
        isAddNewLeaveRequest: true
    }
});

Router.route('viewLeaveRequest', {
    path: '/leaveRequests/:id',
    template: 'userUnavailabilityMainView',
    data: function () {
        return {
            isViewLeaveRequest: true
        }
    },
    waitOn: function () {
        Meteor.subscribe('leaveRequest', this.params.id);
    }
});