Namespace('HospoHero.roles', {
  getRosterApprovers: function(currentAreaId) {
    // TODO: Change to the new permissions
    var roleIds = Meteor.roles.find({
      $or: [
        { permissions: 'ROSTER_APPROVER' },
        { permissions: 'SITE_ALL_RIGHTS' }
      ]
    }).map(function(role) {
      return role._id;
    });

    currentAreaId = currentAreaId || HospoHero.getCurrentAreaId();
    var temp = {};
    temp['roles.' + currentAreaId] = {$in: roleIds};

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