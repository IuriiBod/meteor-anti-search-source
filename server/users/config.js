Accounts.onCreateUser(function (options, user) {
  user.profile = options.profile || {};
  if (user.services.google) {
    var result = options.profile.name.indexOf(' ');
    if (result > 0) {
      var splitName = options.profile.name.split(' ');
      user.profile.firstname = splitName[0];
      user.profile.lastname = splitName[1];
    } else {
      user.profile.firstname = options.profile.name;
      user.profile.lastname = '';
    }
    user.emails = [{"address": null}];
    user.emails[0].address = user.services.google.email;
    user.emails[0].verified = user.services.google.verified_email;// jshint ignore:line
    if (options.profile.picture) {
      user.profile.image = options.profile.picture;
    }
  }
  if (user.profile.pinCode) {
    user.pinCode = user.profile.pinCode;
    delete user.profile.pinCode;
  }

  return user;
});


Accounts.onLogin(function (loginInfo) {
  Meteor.users.update({_id: loginInfo.user._id}, {$set: {lastLoginDate: new Date()}});
});


AntiSearchSource.allow('users', {
  maxLimit: 15,
  securityCheck (userId) {
    return !!userId;
  },
  allowedFields: ['profile.firstname', 'profile.lastname', 'emails.address']
});