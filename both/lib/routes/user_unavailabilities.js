Router.route('userUnavailability', {
    path: '/unavailability',
    template: 'userUnavailabilityMainView',
    waitOn: function () {
        Meteor.subscribe('userUnavailables');
        Meteor.subscribe('leaveRequests');
    },
    data: {
        isUnavailablesList: true
    }
});

Router.route('addNewUnavailability', {
    path: '/unavailability/new',
    template: 'userUnavailabilityMainView',
    data: {
        isAddNewUnavailable: true
    }
});

Router.route('addNewLeaveRequest', {
    path: '/unavailability/newLeaveRequest',
    template: 'userUnavailabilityMainView',
    data: {
        isAddNewLeaveRequest: true
    }
});