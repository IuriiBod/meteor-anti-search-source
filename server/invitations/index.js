Meteor.methods({
  createInvitation: function (invitationData) {
    var area = Areas.findOne({_id: invitationData.areaId});
    var senderId = Meteor.userId();
    var invitation = {
      name: invitationData.name,
      email: invitationData.email,
      invitedBy: senderId,
      areaId: invitationData.areaId,
      organizationId: area.organizationId,
      roleId: invitationData.roleId,
      accepted: false,
      createdAt: Date.now()
    };

    var id = Invitations.insert(invitation);

    new NotificationSender(
      'Added to the ' + area.name + ' area',
      'invitation-email',
      {
        name: invitationData.name,
        areaName: area.name,
        url: Router.url('invitationAccept', {_id: id}),
        sender: HospoHero.username(senderId)
      }
    ).sendEmail(invitationData.email);
  },

  deleteInvitation: function (id) {
    Invitations.remove({_id: id});
  },

  acceptInvitation: function (id, response) {
    var nonProfileItems = ['username', 'email', 'password'];
    var user = {
      profile: {}
    };

    _.extend(user, _.pick(response, nonProfileItems));
    _.extend(user.profile, _.omit(response, nonProfileItems));

    var userId = Accounts.createUser(user);

    Invitations.update({_id: id}, {
      $set: {accepted: true}
    });

    var invitation = Invitations.findOne({_id: id});
    var area = Areas.findOne({_id: invitation.areaId});

    // send a notification to the user
    new NotificationSender(
      'Invitation accepted',
      'invitation-accepted',
      {
        username: invitation.name,
        areaName: area.name
      }
    ).sendBoth(invitation.invitedBy);

    var updateObject = {
      roles: {},
      relations: {
        organizationId: area.organizationId,
        locationIds: [area.locationId],
        areaIds: [area._id]
      }
    };
    updateObject.roles[area._id] = invitation.roleId;
    Meteor.users.update({_id: userId}, {$set: updateObject});
  }
});