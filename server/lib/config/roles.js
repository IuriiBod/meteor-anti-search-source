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
  "View calendar": "view calendar",
  "Edit calendar": "edit calendar",
  "Create meetings": "create meetings",
  "Edit projects": "edit projects",
  "Edit interviews": "edit interviews"
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
      "view area reports",
      "edit locations",
      "be rosted",
      "edit user's payrate",
      "view reports",
      "receive deliveries",
      "approve leave requests",
      "view calendar",
      "edit calendar",
      "create meetings",
      "edit projects",
      "edit interviews"
    ]
  },

  {
    name: 'Worker',
    actions: [
      "view jobs",
      "view menus",
      "view roster",
      "view stocks",
      "be rosted",
      "receive deliveries",
      "view calendar",
      "edit calendar"
    ]
  }
];

Roles.configure({actions: actions, defaultRoles: defaultRoles});