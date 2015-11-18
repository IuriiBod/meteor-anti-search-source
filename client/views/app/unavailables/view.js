Template.userUnavailabilityMainView.onRendered(function () {
});

Template.userUnavailabilityMainView.helpers({
    'isUnavailablesList': function () {
        return this.userUnavailability || false;
    },
    'isAddNewUnavailable': function () {
        return this.addNewUnavailability || false;
    },
    'isAddNewLeaveRequest': function () {
        return this.addNewLeaveRequest || false;
    },
    'isViewLeaveRequest': function () {
        return this.viewLeaveRequest || false;
    }
});