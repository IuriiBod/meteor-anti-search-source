let extractFirstAndLastName = function (username) {
  var tokenizeName = username.split(' ');
  var firstName = tokenizeName.splice(0, 1)[0];
  var lastName = tokenizeName.join(' ');
  return {
    firstname: firstName,
    lastname: lastName
  }
};


let randomPassword = function () {
  return Math.random().toString(36).slice(-8); // generates random 8 characters password
};


let createNewUser = function (newUserDocument, roleId, area) {
  var userId = Accounts.createUser(newUserDocument);

  var updateObject = {
    roles: {
      [area._id]: roleId
    },
    relations: {
      organizationIds: [area.organizationId],
      locationIds: [area.locationId],
      areaIds: [area._id]
    },
    currentAreaId: area._id
  };

  Meteor.users.update({_id: userId}, {$set: updateObject});
};


let sendEmailInvitation = function (newUserDocument, email, area) {
  var sender = Meteor.user();

  let notificationSender = new NotificationSender(
    'You was added to the ' + area.name + ' area',
    'invitation-email',
    {
      firstName: newUserDocument.profile.firstname,
      password: newUserDocument.password,
      email: email,
      areaName: area.name,
      invitationSender: {
        name: `${sender.profile.firstname} ${sender.profile.lastname}`,
        tel: sender.profile.tel,
        email: sender.emails[0].address
      }
    },
    {
      helpers: {
        signInUrl: function () {
          return NotificationSender.urlFor('signIn', {}, this);
        }
      }
    }
  );

  notificationSender.sendEmail(email);
};


Meteor.methods({
  inviteNewUserToArea: function (invitationMeta) {
    check(invitationMeta, {
      name: HospoHero.checkers.forNonEmptyString('Name'),
      email: HospoHero.checkers.Email,
      areaId: HospoHero.checkers.MongoId,
      roleId: HospoHero.checkers.MongoId
    });

    if (this.userId && HospoHero.canUser("invite users", this.userId)) {
      //check if user with specified email exists
      let existingUser = Meteor.users.findOne({'emails.address': invitationMeta.email});
      if (existingUser) {
        //simply add him to specified area
        Meteor.call('addUserToArea', {
          userId: existingUser._id,
          areaId: invitationMeta.areaId,
          roleId: invitationMeta.roleId
        });
      } else {
        var area = Areas.findOne({_id: invitationMeta.areaId});

        //create new user
        var newUserDocument = {
          email: invitationMeta.email,
          password: randomPassword(),
          profile: extractFirstAndLastName(invitationMeta.name)
        };

        createNewUser(newUserDocument, invitationMeta.roleId, area);

        //notify user about his new account
        sendEmailInvitation(newUserDocument, invitationMeta.email, area);
      }
    } else {
      throw new Meteor.Error('You cannot invite users');
    }
  }
});