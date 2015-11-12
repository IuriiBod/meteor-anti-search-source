var component = FlowComponents.define('unavailabilitiesComponent', function (props) {
    this.componentType = props.type;
});

component.state.componentName = function () {
    if (this.get('isUnavailables')) {
        return 'unavailables';
    } else if (this.get('isLeaveRequests')) {
        return 'leave requests';
    }
};

component.state.isLeaveRequests = function () {
    return this.componentType == 'leaveRequests';
};

component.state.isUnavailables = function () {
    return this.componentType == 'unavailables';
};

// Can be leave requests or unavailables
component.state.items = function () {
    if (this.get('isUnavailables')) {
        return Meteor.user().unavailables || [];
    } else if (this.get('isLeaveRequests')) {
        return LeaveRequests.find();
    }
};

component.state.leaveRequests = function () {
    return [];
};

component.state.componentHeader = function () {
    if (this.get('isUnavailables')) {
        return 'UNAVAILABILITY'
    } else if (this.get('isLeaveRequests')) {
        return 'LEAVE REQUESTS'
    };
};

component.action.newItem = function () {
    if (this.get('isUnavailables')) {
        Router.go('addNewUnavailability');
    } else if (this.get('isLeaveRequests')) {
        Router.go('addNewLeaveRequest');
    }
};