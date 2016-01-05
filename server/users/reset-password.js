var defaultHash = '$2a$10$q3hxdkZXLsRCQZcj00oOa.8NLSkXDw958G3zkwGPzp/v.Ezphv0T2';

hardResetUserPassword = function (id) {
  Meteor.users.update({_id: id}, {$unset: {'services': ''}});
  Meteor.users.update({_id: id}, {$set: {'services.password.bcrypt': defaultHash, pinCode: '1111'}});
};