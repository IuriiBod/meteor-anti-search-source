var component = FlowComponents.define('leaveRequestItem', function (props) {
    this.item = props.item;
});

component.state.date = function () {
    var startDate = moment(this.item.startDate).format('ddd D MMM');
    var endDate = moment(this.item.endDate).format('ddd D MMM');

    return {
        startDate: startDate,
        endDate: endDate
    }
};

component.state.comment = function () {
    return this.item.comment || false;
};

component.state.status = function () {
    if (this.get('isApproved')) {
        return {
            text: 'Approved',
            style: 'status-approved'
        };
    }
    if (this.get('isDeclined')) {
        return {
            text: 'Declined',
            style: 'status-declined'
        };
    }
    if (this.get('isAwaiting')) {
        return {
            text: 'Awaiting',
            style: 'status-awaiting'
        };
    }
};

component.state.isApproved = function () {
    return this.item.status == 'approved';
};

component.state.isDeclined = function () {
    return this.item.status == 'declined';
};

component.state.isAwaiting = function () {
    return this.item.status == 'awaiting';
};

component.action.removeLeaveRequest = function () {
    Meteor.call('removeLeaveRequest', this.item._id);
};