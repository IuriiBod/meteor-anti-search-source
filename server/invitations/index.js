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
    var url = process.env.ROOT_URL + "invitations/" + id;

    var text = "Hi " + name + ",<br><br>";
    text += "You've been added to the " + area.name + " area.<br>";
    text += "To complete registration go on this link: <a href='" + url + "'>" + url + "</a><br><br>";
    text += "If you have any questions let me know.<br>";
    text += senderInfo.username;

    Email.send({
      "to": email,
      "from": senderInfo.emails[0].address,
      "subject": "[Hero Chef] Added to the "+ area.name + " area",
      "html": text
    });
  },

  deleteInvitation: function(id) {
    Invitations.remove({_id: id});
  },

  acceptInvitation: function(id, user) {
    var userId = Accounts.createUser(user);

    Invitations.update({_id: id}, {
      $set: { accepted: true }
    });

    var invitation = Invitations.findOne({_id: id});
    var options = {
      type: 'invitation',
      title: 'User ' + invitation.name + ' has accept your invitation',
      actionType: 'update',
      to: invitation.invitedBy
    };
    Meteor.call('sendNotification', options);

    var areaId = invitation.areaId;
    var area = Areas.findOne({_id: areaId});
    var updateObject = {
      roles: {},
      relations: {
        organizationId: area.organizationId,
        locationIds: [area.locationId],
        areaIds: [areaId]
      }
    };
    updateObject.roles[areaId] = invitation.roleId;
    Meteor.users.update({_id: userId}, {$set: updateObject});
  }
});