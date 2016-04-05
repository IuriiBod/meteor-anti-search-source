Template.leaveRequestsListItem.onRendered(function () {
  this.$('.status-info').popover({html: true});
});

Template.leaveRequestsListItem.helpers({
  comment () {
    return this.comment !== '' ? this.comment : '-';
  },
  isReject(status) {
    return status ? status.value === 'rejected' : false;
  },
  isApprove(status) {
    return status ? status.value === 'approved' : false;
  }
});

Template.leaveRequestsListItem.events({
  'click .manager-status-button': (event, tmpl) => {
    event.preventDefault();
    let status = $(event.target).hasClass('approved') ? 'approved' : 'rejected';
    Meteor.call('changeLeaveRequestStatus', tmpl.data._id, status, HospoHero.handleMethodResult);
  },
  'mouseleave .status-info': (event) => {
    $(event.target).popover('hide');
  }
});

Template.leaveRequestsListItem.onDestroyed(function () {
  this.$('.status-info').popover('destroy');
});
