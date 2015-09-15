Meteor.methods({
  createInvitation: function (email, name, senderInfo, areaId) {
    var area = Areas.findOne({_id: areaId});
    var invitation = {
      name: name,
      email: email,
      invitedBy: senderInfo._id,
      areaId: areaId,
      accepted: false,
      createdAt: Date.now()
    };

    var id = Invitations.insert(invitation);
    var url = process.env.ROOT_URL + "invitations/" + id;

    var text = "Hi " + name + ",<br><br>";
    text += "You've been added to the " + area.name + " area.<br>";
    text += "To complete registration go on this link: <a href='" + url + "'>" + url + "</a><br><br>";
    text += "If you have any questions let me know.<br>";
    text += senderInfo.name;

    Email.send({
      "to": email,
      "from": senderInfo.email,
      "subject": "[Hero Chef] Added to the "+ area.name + " area",
      "html": text
    });
  },

  deleteInvitation: function(id) {
    Invitations.remove({_id: id});
  },

  acceptInvitation: function(id, userId) {
    Invitations.update({_id: id}, {
      $set: { accepted: true }
    });

    var invitation = Invitations.findOne({_id: id});
    var options = {
      type: 'organization',
      read: false,
      title: 'User ' + invitation.name + ' has accept your invitation',
      createdBy: null,
      text: null,
      actionType: 'update',
      to: invitation.invitedBy
    };
    Notifications.insert(options);

    var area = Areas.findOne({_id: invitation.areaId});
    if(area) {
      Relations.insert({
        organizationId: area.organizationId,
        locationIds: [area.locationId],
        areaIds: [area._id],
        entityId: userId,
        collectionName: "users"
      });
    }
  },

  createInvitedUser: function(user) {
    var id = Accounts.createUser(user);
    return id;
  }
});