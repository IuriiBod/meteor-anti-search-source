Meteor.methods({
  createInvitation: function (invitationData) {
    var area = Areas.findOne({_id: invitationData.areaId});
    var senderId = Meteor.userId();
    var invitedUserName = invitationData.name;
    var splittedUserName = [];

    if (invitedUserName.indexOf(' ') > 0) {
      splittedUserName = invitedUserName.split(' ');
    }

    var invitation = {
      firstname: splittedUserName[0] || invitationData.name,
      lastname: splittedUserName[2] ? splittedUserName[1] + splittedUserName[2] : splittedUserName[1] || null,
      email: invitationData.email,
      invitedBy: senderId,
      areaId: invitationData.areaId,
      organizationId: area.organizationId,
      roleId: invitationData.roleId,
      accepted: false,
      createdAt: Date.now()
    };

    var invitationId = Invitations.insert(invitation);

    new NotificationSender(
      'Added to the ' + area.name + ' area',
      'invitation-email',
      {
        name: invitationData.name,
        areaName: area.name,
        invitationId: invitationId,
        sender: HospoHero.username(senderId)
      },
      {
        helpers: {
          url: function () {
            return NotificationSender.urlFor('invitationAccept', {_id: this.invitationId}, this);
          }
        }
      }
    ).sendEmail(invitationData.email);
  },

  deleteInvitation: function (id) {
    Invitations.remove({_id: id});
  },

  acceptInvitation: function (id, response) {
    var nonProfileItems = ['email', 'password'];
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
        username: invitation.lastname ? invitation.firstname + " " + invitation.lastname : invitation.firstname,
        areaName: area.name
      }
    ).sendBoth(invitation.invitedBy);

    var updateObject = {
      roles: {},
      relations: {
        organizationIds: [area.organizationId, Meteor.users.findOne({_id: userId}).relations.organizationIds],
        locationIds: [area.locationId],
        areaIds: [area._id]
      },
      currentAreaId: area._id
    };
    updateObject.roles[area._id] = invitation.roleId;
    Meteor.users.update({_id: userId}, {$set: updateObject});
  }
});