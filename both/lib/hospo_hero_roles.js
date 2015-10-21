Namespace('HospoHero.roles', {
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
    "View areas financial info": "view area's financial info",
    "Edit Locations": "edit locations",
    "Billing Account": "edit billing account",
    "Edit Organization": "edit organization settings",
    "All Rights": "all rights",
    "Edit users payrate": "edit user's payrate"
  },

  getActions: function() {
    return _.map(HospoHero.roles.actions, function(action, text) {
      return {
        value: action,
        text: text
      };
    });
  }
});