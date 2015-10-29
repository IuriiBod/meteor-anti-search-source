var defaultHash = '$2a$10$q3hxdkZXLsRCQZcj00oOa.8NLSkXDw958G3zkwGPzp/v.Ezphv0T2';

hardResetUserPassword = function (username) {
  Meteor.users.update({username: username}, {$unset: 'services'});
  Meteor.users.update({username: username}, {$set: {'services.passwords.bcrypt': defaultHash, pinCode: '1111'}});
};