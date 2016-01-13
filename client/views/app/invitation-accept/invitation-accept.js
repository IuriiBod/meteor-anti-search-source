Template.invitationAccept.helpers({
  invitation: function () {
    var id = Router.current().params._id;
    if (id) {
      return Invitations.findOne({_id: id});
    }
  }
});