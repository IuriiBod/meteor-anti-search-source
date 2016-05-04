// disable camelcase warnings
/*jshint camelcase: false */

Meteor.startup(function () {
  IntercomSettings.userInfo = function (user, info) {
    if (!user.intercomHash) {
      return false;
    }

    let currentArea = HospoHero.getCurrentArea(user._id);
    if (currentArea) {
      let organization = Organizations.findOne({_id: currentArea.organizationId});
      let role = Meteor.roles.findOne({_id: user.roles[currentArea._id]});

      _.extend(info, {
        email: user.emails[0].address,
        name: user.profile.fullName,
        role: role && role.name || '-',
        created_at: new Date(user.createdAt).getTime(),
        company: {
          id: organization._id,
          name: organization.name,
          created_at: organization.createdAt
        }
      });
    }
  };
});
