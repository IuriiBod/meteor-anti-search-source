Meteor.startup(function () {
  IntercomSettings.userInfo = function (user, info) {
    if (!user.intercomHash) {
      return false;
    } else {
      // add properties to the info object, for instance:
      if (user.services && user.services.google) {
        info.email = user.services.google.email;
        info['name'] = user.services.google.given_name + ' ' + user.services.google.family_name;
      } else {
        info.email = user.emails[0].address;
        info['name'] = user.profile.firstname;
      }
      info['created_at'] = new Date(user.createdAt).getTime();
    }
  };
});
