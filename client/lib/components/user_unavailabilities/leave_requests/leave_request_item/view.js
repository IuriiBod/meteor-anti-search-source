Template.leaveRequestItem.events({
    'click #removeLeaveRequestBtn': function () {
        FlowComponents.callAction('removeLeaveRequest');
    }
});