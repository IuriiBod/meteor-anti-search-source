Template.userUnavailabilityMainView.onRendered(function () {
});

Template.userUnavailabilityMainView.helpers({
    'isUnavailablesList': function () {
        return Template.instance().data.isUnavailablesList || false;
    },
    'isAddNewUnavailable': function () {
        return Template.instance().data.isAddNewUnavailable || false;
    },
    'isAddNewLeaveRequest': function () {
        return Template.instance().data.isAddNewLeaveRequest || false;
    },
    'isViewLeaveRequest': function () {
        return Template.instance().data.isViewLeaveRequest || false;
    }
});