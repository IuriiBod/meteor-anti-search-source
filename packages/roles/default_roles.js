if(Meteor.isServer) {
  if(Meteor.roles.find().count() == 0) {
    var defaultRoles = [
      {
        name: 'Owner',
        permissions: [
          'SITE_ALL_RIGHTS'
        ],
        default: true
      },

      {
        name: 'Manager',
        permissions: [
          Roles.permissions.Job.view.code,
          Roles.permissions.Job.edit.code,
          Roles.permissions.Menu.view.code,
          Roles.permissions.Menu.edit.code,
          Roles.permissions.Roster.view.code,
          Roles.permissions.Roster.edit.code,
          Roles.permissions.Roster.canBeRosted.code,
          Roles.permissions.Roster.canBeRosted.code,
          Roles.permissions.Stock.view.code,
          Roles.permissions.Stock.edit.code,
          Roles.permissions.User.edit.code,
          Roles.permissions.User.editPayrate.code,
          Roles.permissions.User.invite.code,
          Roles.permissions.Forecast.view.code,
          Roles.permissions.Area.viewFinancialInfo.code,
          Roles.permissions.Area.edit.code,
          Roles.permissions.Location.edit.code,
          Roles.permissions.Organization.edit.code,
          Roles.permissions.Organization.billing.code
        ],
        default: true
      },

      {
        name: 'Worker',
        permissions: [
          Roles.permissions.Job.view.code,
          Roles.permissions.Menu.view.code,
          Roles.permissions.Roster.view.code,
          Roles.permissions.Roster.canBeRosted.code,
          Roles.permissions.Stock.view.code
        ],
        default: true
      }
    ];

    defaultRoles.forEach(function(role) {
      Meteor.roles.insert(role);
    });
    console.log('Default roles created');
  }
}
