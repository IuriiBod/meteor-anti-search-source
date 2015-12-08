var component = FlowComponents.define('viewLeaveRequest', function (props) {
    this.mode = props.mode;

    if (props.leaveRequestId) {
        this.set('leaveRequest', LeaveRequests.findOne({_id: props.leaveRequestId}));
    }
});


component.state.isReviewMode = function () {
    return this.mode == 'review' && this.get('leaveRequest');
};

component.state.canBeApprovedOrDeclined = function () {
    if (this.get('isReviewMode')) {
        return !this.get('leaveRequest').approved && !this.get('leaveRequest').declined;
    }
    return false;
};

component.state.managers = function () {
    var managersIds = HospoHero.roles.getUserIdsByAction('approve leave requests');
    managersIds = _.reject(managersIds, function (id) {
        return id == Meteor.userId();
    });

    return Meteor.users.find({_id: {$in: managersIds}});
};

component.state.formatDate = function (date) {
    return moment(date).format('ddd D MMM');
};

component.action.saveLeaveRequest = function (newLeaveRequest, flyout) {
    newLeaveRequest.startDate = newLeaveRequest.startDate.toDate();
    newLeaveRequest.endDate = newLeaveRequest.endDate.toDate();

    // close flyout, if success
    Meteor.call('createNewLeaveRequest', newLeaveRequest, HospoHero.handleMethodResult(function () {
        flyout.close();
    }));
};

component.action.approveLeaveRequest = function () {
    Meteor.call('approveLeaveRequest', this.get('leaveRequest')._id, HospoHero.handleMethodResult());
};
component.action.declineLeaveRequest = function () {
    Meteor.call('declineLeaveRequest', this.get('leaveRequest')._id, HospoHero.handleMethodResult());
};