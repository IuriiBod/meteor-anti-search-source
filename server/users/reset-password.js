var defaultHash = '$2a$10$q3hxdkZXLsRCQZcj00oOa.8NLSkXDw958G3zkwGPzp/v.Ezphv0T2';

hardResetUserPassword = function (idOrFirstname) {
  var id;
  var user;

  if (user = Meteor.users.findOne({_id: idOrFirstname})) {
    id = idOrFirstname;
  } else if (user = Meteor.users.findOne({'profile.firstname': idOrFirstname})) {
    id = user._id;
  } else {
    return false;
  }

  Meteor.users.update({_id: id}, {$unset: {'services': ''}});
  Meteor.users.update({_id: id}, {
    $set: {
      'services.password.bcrypt': defaultHash,
      pinCode: '1111',
      'emails.0.address': user.profile.firstname.toLowerCase() + '@mail.com'
    }
  });
};