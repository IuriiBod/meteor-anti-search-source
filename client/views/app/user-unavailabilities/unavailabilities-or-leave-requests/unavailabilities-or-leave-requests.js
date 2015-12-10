Template.unavailabilitiesOrLeaveRequests.onCreated(function () {
  this.set('isUnavailability', this.data.type === 'unavailabilities');
});

Template.unavailabilitiesOrLeaveRequests.helpers({
  templateName: function () {
    return Template.instance().get('isUnavailability') ? 'Unavailables' : 'Leave Requests';
  },
  // Can be leave requests or unavailables
  items: function () {
    if (Template.instance().get('isUnavailability')) {
      var unavailabilities = Meteor.user().unavailabilities || [];
      return _.sortBy(unavailabilities, 'startDate');
    } else {
      return LeaveRequests.find({
        userId: Meteor.userId()
      }, {sort: {startDate: 1}}).fetch();
    }
  }
});

Template.unavailabilitiesOrLeaveRequests.events({
  'click .new-item-button': function (event, tmpl) {
    if (tmpl.get('isUnavailability')) {
      FlyoutManager.open('addNewUnavailability');
    } else {
      FlyoutManager.open('viewLeaveRequest', {}, true);
    }
  }
});