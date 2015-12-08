Template.invitationsList.onCreated(function () {
  this.set('isAccepted', false);
});

Template.invitationsList.helpers({
  invitations: function () {
    return Invitations.find({
      organizationId: this.organizationId,
      accepted: Template.instance().get('isAccepted')
    });
  }
});

Template.invitationsList.events({
  'click .show-unaccepted': function (event, tmpl) {
    tmpl.set('isAccepted', false);
  },

  'click .show-accepted': function (event, tmpl) {
    tmpl.set('isAccepted', true);
  },

  'click .delete-invitation': function (event) {
    event.preventDefault();
    Meteor.call('deleteInvitation', this._id, HospoHero.handleMethodResult());
  }
});