Router.route('userUnavailability', {
    path: '/unavailabilities',
    template: 'userUnavailabilityMainView',
    waitOn: function () {
        var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
        return [
            Meteor.subscribe('userAllUnavailabilities'),
            Meteor.subscribe('userAllLeaveRequests'),
            Meteor.subscribe('usersList', currentAreaId)
        ];
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
    },
    waitOn: function () {
        var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
        return [
            Meteor.subscribe('usersList', currentAreaId)
        ];
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
        return Meteor.subscribe('leaveRequest', this.params.id);
    }
});