Meteor.methods({
  createInvitation: function (email, name, areaId, roleId) {
    var area = Areas.findOne({_id: areaId});
    var senderInfo = Meteor.user();
    var invitation = {
      name: name,
      email: email,
      invitedBy: senderInfo._id,
      areaId: areaId,
      organizationId: area.organizationId,
      roleId: roleId,
      accepted: false,
      createdAt: Date.now()
    };

    var id = Invitations.insert(invitation);

    new NotificationSender(
      'Added to the ' + area.name + ' area',
      'invitation-email',
      {
        name: name,
        areaName: area.name,
        url: process.env.ROOT_URL + "invitations/" + id,
        sender: HospoHero.username(Meteor.userId())
      }
    ).sendEmail(email);
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