Namespace('HospoHero.roles', {
  getUserIdsByAction: function (action) {
    var roleIds = Meteor.roles.find({
      $or: [
        {actions: action},
        {actions: 'all rights'}
      ]
    }).map(function (role) {
      return role._id;
    });

    let currentAreaId = HospoHero.getCurrentAreaId();
    let query = {
      [`roles.${currentAreaId}`]: {$in: roleIds}
    };

    return Meteor.users.find(query).map(function (user) {
      if (user._id != Meteor.userId()) {
        return user._id;
      }
    });
  },

  getUserRoleName: function (userId, areaId) {
    userId = userId || Meteor.userId();
    areaId = areaId || HospoHero.getCurrentAreaId(userId);

    var area = Areas.findOne({_id: areaId});
    if (!!Organizations.findOne({_id: area.organizationId, owners: userId})) {
      return 'Owner';
    } else {
      var user = Meteor.users.findOne({_id: userId});
      var roleId = user.roles[areaId] || false;
      var role = Roles.getRoleById(roleId);
      return role && role.name || '';
    }
  },

  actions: {
    "View Jobs": "view jobs",
    "Edit Jobs": "edit jobs",
    "View Menus": "view menus",
    "Edit Menus": "edit menus",
    "View Roster": "view roster",
    "Edit Roster": "edit roster",
    "Can be rosted": "be rosted",
    "Roster Approver": "approves roster requests",
    "View Stocks": "view stocks",
    "Edit Stocks": "edit stocks",
    "Invite Users": "invite users",
    "Edit Users": "edit users",
    "View Forecast": "view forecast",
    "Edit Areas": "edit areas",
    "View Area Reports": "view area reports",
    "View areas financial info": "view area's financial info",
    "Edit Locations": "edit locations",
    "Billing Account": "edit billing account",
    "Edit Organization": "edit organization settings",
    "All Rights": "all rights",
    "Edit users payrate": "edit user's payrate",
    "View Reports": "view reports",
    "Receive Deliveries": "receive deliveries",
    "Approve leave requests": "approve leave requests",
    "Edit calendar": "edit calendar",
    "View calendar": "view calendar",
    "Create meetings": "create meetings",
    "Edit projects": "edit projects"
  },

  getActions: function () {
    return _.map(HospoHero.roles.actions, function (action, text) {
      return {
        value: action,
        text: text
      };
    });
  }
});