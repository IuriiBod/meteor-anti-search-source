Template.userRolesSelect.helpers({
  userRoles: function () {
    return Meteor.roles.find({
      name: {
        $ne: 'Owner'
      }
    });
  }
});