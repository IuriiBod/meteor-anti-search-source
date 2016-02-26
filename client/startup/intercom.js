Meteor.startup(function () {
  IntercomSettings.userInfo = function (user, info) {
    if (!user.intercomHash) {
      return false;
    } else {
      info.email = user.emails[0].address;
      info.name = user.profile.firstname + ' ' + user.profile.lastname;
      info['created_at'] = new Date(user.createdAt).getTime();
    }
  };
});
