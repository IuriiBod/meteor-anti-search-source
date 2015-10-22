Namespace('HospoHero.roles', {
  getUserIdsByAction: function(action) {
    // TODO: Change to the new permissions
    var roleIds = Meteor.roles.find({
      $or: [
        { permissions: action },
        { permissions: 'SITE_ALL_RIGHTS' }
      ]
    }).map(function(role) {
      return role._id;
    });

    var temp = {};
    temp['roles.' + HospoHero.getCurrentAreaId()] = {$in: roleIds};

    var query = {
      $or: [
        { 'roles.defaultRole': {$in: roleIds} },
        temp
      ]
    };

    return Meteor.users.find(query).map(function(user) {
      return user._id;
    });
  }
});