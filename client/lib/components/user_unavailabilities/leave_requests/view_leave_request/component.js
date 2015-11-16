var component = FlowComponents.define('viewLeaveRequest', function (props) {
    this.mode = props.mode;

    this.set('leaveRequest', LeaveRequests.findOne());
});


component.state.isReviewMode = function () {
    return this.mode == 'review';
};

component.state.canBeApprovedOrDeclined = function () {
    if (this.get('isReviewMode')) {
        return !this.get('leaveRequest').approved && !this.get('leaveRequest').declined;
    }
    return false;
};

component.state.managers = function () {
    var managers = [];
    Meteor.users.find().forEach(function (user) {
        if (HospoHero.isManager(user._id)) {
            //if (HospoHero.isManager(user._id) && user._id != Meteor.userId()) {
            managers.push({
                _id: user._id,
                name: user.profile.name || user.username
            });
        }
    });
    return managers;
};

component.action.saveLeaveRequest = function (newLeaveRequest) {
    newLeaveRequest.startDate = new Date(newLeaveRequest.startDate);
    newLeaveRequest.endDate = new Date(newLeaveRequest.endDate);

    Meteor.call('createNewLeaveRequest', newLeaveRequest, HospoHero.handleMethodResult());
    Router.go('userUnavailability');
};

component.action.approveLeaveRequest = function () {
    Meteor.call('approveLeaveRequest', this.get('leaveRequest')._id);
    Router.go('userUnavailability');
};
component.action.declineLeaveRequest = function () {
    Meteor.call('declineLeaveRequest', this.get('leaveRequest')._id);
    Router.go('userUnavailability');
};