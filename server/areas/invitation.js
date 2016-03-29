let extractFirstAndLastName = function (username) {
  var tokenizeName = username.split(' ');
  var firstName = tokenizeName.splice(0, 1)[0];
  var lastName = tokenizeName.join(' ');
  return {
    firstname: firstName,
    lastname: lastName
  };
};


let randomPassword = function () {
  return Math.random().toString(36).slice(-8); // generates random 8 characters password
};

let randomPinCode = function () {
  return Math.random().toString(10).slice(-4);  // for digit PIN
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
    }
  };

  Meteor.users.update({_id: userId}, {$set: updateObject});

  return Meteor.users.findOne({_id: userId});
};


let sendEmailInvitation = function (createdUser, password, area) {
  var sender = Meteor.user();

  let createdUserEmail = createdUser.emails[0].address;

  let notificationSender = new NotificationSender(
    'You have been added to the ' + area.name + ' area',
    'invitation',
    {
      firstName: createdUser.profile.firstname,
      password: password,
      pinCode: createdUser.pinCode,
      email: createdUserEmail,
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

  notificationSender.sendEmail(createdUserEmail);
};


Meteor.methods({
  inviteNewUserToArea: function (invitationMeta) {
    check(invitationMeta, {
      name: HospoHero.checkers.forNonEmptyString('Name'),
      email: HospoHero.checkers.Email,
      areaId: HospoHero.checkers.MongoId,
      roleId: HospoHero.checkers.MongoId
    });

    let checker = new HospoHero.security.PermissionChecker(this.userId);

    if (this.userId && checker.hasPermissionInArea(invitationMeta.areaId, 'invite users')) {
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

        let password = randomPassword();
        //create new user
        var newUserDocument = {
          email: invitationMeta.email,
          password: password,
          profile: _.extend(extractFirstAndLastName(invitationMeta.name), {
            pinCode: randomPinCode() // write PIN code into profile because of /server/users/index.js:22
          })
        };
        var createdUser = createNewUser(newUserDocument, invitationMeta.roleId, area);

        //notify user about his new account
        sendEmailInvitation(createdUser, password, area);
      }
    } else {
      throw new Meteor.Error('You cannot invite users');
    }
  }
});