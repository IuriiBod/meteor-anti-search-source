Meteor.methods({
  'createInvitation': function (email, name, senderInfo, areaId) {
    var area = Areas.findOne({_id: areaId});
    var invitation = {
      name: name,
      email: email,
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

    // TODO: Uncoment later
    Email.send({
      "to": email,
      "from": senderInfo.email,
      "subject": "[Hero Chef] Added to the "+ area.name + " area",
      "html": text
    });
  },

  'deleteInvitation': function(id) {
    Invitations.remove({_id: id});
  }
});