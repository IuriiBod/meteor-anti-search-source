Meteor.publish('invitationById', function (id) {
  return Invitations.find({_id: id});
});