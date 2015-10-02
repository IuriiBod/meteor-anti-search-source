Template.invitationsList.events({
  'click .show-unaccepted': function() {
    FlowComponents.callAction('changeAccepted', false);
  },

  'click .show-accepted': function() {
    FlowComponents.callAction('changeAccepted', true);
  },

  'click .delete-invitation': function(e) {
    e.preventDefault();
    FlowComponents.callAction('deleteInvitation', this._id);
  }
});