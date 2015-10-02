Migrations.add({
  version: 2,
  name: "Change Admin to Owner",
  up: function() {
    var role = Meteor.roles.findOne({name: 'Admin'});
    if(role) {
      Meteor.roles.update({
        _id: role._id
      }, {
        $set: {
          name: 'Owner'
        }
      });

      role = Meteor.roles.findOne({name: 'Manager'});
      var newPermissions = [
        'JOB_VIEW',
        'JOB_EDIT',
        'MENU_VIEW',
        'MENU_EDIT',
        'ROSTER_VIEW',
        'ROSTER_EDIT',
        'ROSTER_CAN_BE_ROSTED',
        'ROSTER_APPROVER',
        'STOCK_VIEW',
        'STOCK_EDIT',
        'USER_INVITE',
        'USER_EDIT',
        'USER_EDIT_PAYRATE',
        'FORECAST_VIEW',
        'AREA_EDIT',
        'AREA_VIEW_FINANCIAL_INFO',
        'LOCATION_EDIT',
        'ORGANIZATION_BILLING',
        'ORGANIZATION_EDIT',
        'SITE_ALL_RIGHTS'
      ];

      Meteor.roles.update({
        _id: role._id
      }, {
        $set: {
          permissions: newPermissions
        }
      });
      console.log('Migration successfully completed');
    }
  }
});