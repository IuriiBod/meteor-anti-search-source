var component = FlowComponents.define('unavailabilitiesOrLeaveRequestsComponent', function (props) {
  this.componentType = props.type;
});

component.state.componentName = function () {
  if (this.get('isUnavailabilities')) {
    return 'unavailables';
  } else if (this.get('isLeaveRequests')) {
    return 'leave requests';
  }
};

component.state.isLeaveRequests = function () {
  return this.componentType == 'leaveRequests';
};

component.state.isUnavailabilities = function () {
  return this.componentType == 'unavailabilities';
};

// Can be leave requests or unavailables
component.state.items = function () {
  if (this.get('isUnavailabilities')) {
    var unavailabilities = Meteor.user().unavailabilities || [];
    unavailabilities = _.sortBy(unavailabilities, 'startDate');

    return unavailabilities;
  } else if (this.get('isLeaveRequests')) {
    return LeaveRequests.find({}, {sort: {startDate: 1}}).fetch();
  }
};

component.state.leaveRequests = function () {
  return [];
};

component.state.componentHeader = function () {
  if (this.get('isUnavailabilities')) {
    return 'UNAVAILABILITY'
  } else if (this.get('isLeaveRequests')) {
    return 'LEAVE REQUESTS'
  }
};

component.action.newItem = function () {
  if (this.get('isUnavailabilities')) {
    FlyoutManager.open('addNewUnavailability', {}, true);
  } else if (this.get('isLeaveRequests')) {
    FlyoutManager.open('viewLeaveRequest', {}, true);
  }
};