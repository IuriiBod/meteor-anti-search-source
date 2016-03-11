var defaultHash = '$2a$10$q3hxdkZXLsRCQZcj00oOa.8NLSkXDw958G3zkwGPzp/v.Ezphv0T2';

hardResetUserPassword = function (idOrFirstName) {
  var user = Meteor.users.findOne({
    $or: [
      {_id: idOrFirstName},
      {'profile.firstname': idOrFirstName}
    ]
  });

  if (!user) {
    return false;
  }

  Meteor.users.update({_id: user._id}, {$unset: {'services': ''}});
  Meteor.users.update({_id: user._id}, {
    $set: {
      'services.password.bcrypt': defaultHash,
      pinCode: '1111',
      'emails.0.address': user.profile.firstname.toLowerCase() + '@mail.com'
    }
  });
};