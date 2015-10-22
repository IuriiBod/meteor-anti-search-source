var actions = {
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
};

var defaultRoles = [
  {
    name: 'Owner',
    actions: [
      "all rights"
    ]
  },

  {
    name: 'Manager',
    actions: [
      "view jobs",
      "edit jobs",
      "view menus",
      "edit menus",
      "view roster",
      "edit roster",
      "approves roster requests",
      "view stocks",
      "edit stocks",
      "invite users",
      "edit users",
      "view forecast",
      "edit areas",
      "edit locations",
      "be rosted",
      "edit user's payrate"
    ]
  },

  {
    name: 'Worker',
    actions: [
      "view jobs",
      "view menus",
      "view roster",
      "view stocks",
      "be rosted"
    ]
  }
];

Roles.configure({actions: actions, defaultRoles: defaultRoles});