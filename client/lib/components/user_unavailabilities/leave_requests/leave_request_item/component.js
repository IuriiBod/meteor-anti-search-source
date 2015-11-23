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
    return this.item.status;
};

component.action.removeLeaveRequest = function () {
    Meteor.call('removeLeaveRequest', this.item._id);
};