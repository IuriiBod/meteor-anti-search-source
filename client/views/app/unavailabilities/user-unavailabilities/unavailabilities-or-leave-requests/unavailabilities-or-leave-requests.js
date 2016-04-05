Template.unavailabilitiesOrLeaveRequests.onCreated(function () {
  this.set('isUnavailability', this.data.type === 'unavailabilities');
});

Template.unavailabilitiesOrLeaveRequests.helpers({
  templateName: function () {
    return Template.instance().get('isUnavailability') ? 'Unavailabilities' : 'Leave Requests';
  },
  // Can be leave requests or unavailables
  items: function () {
    var user = Meteor.user();
    return Template.instance().get('isUnavailability') ?
      Unavailabilities.find({userId: user._id}, {sort: {startDate: 1}}) :
      LeaveRequests.find({userId: user._id}, {sort: {startDate: 1}});
  }
});

Template.unavailabilitiesOrLeaveRequests.events({
  'click .new-item-button': function (event, tmpl) {
    if (tmpl.get('isUnavailability')) {
      FlyoutManager.open('addNewUnavailability');
    } else {
      FlyoutManager.open('viewLeaveRequest', {});
    }
  }
});