Template.userPermissions.onCreated(function () {
  this.set('selectedUser', this.data.selectedUser);
});

Template.userPermissions.events({
  'click .add-existing-user': function (event, tmpl) {
    var roleId = $('select[name="userRole"]').val();

    var addedUserInfo = {
      userId: tmpl.data.selectedUser,
      areaId: tmpl.data.areaId,
      roleId: roleId
    };

    Meteor.call('addUserToArea', addedUserInfo, HospoHero.handleMethodResult(function () {
      HospoHero.success('The user was notified');
      tmpl.data.onPermissionSelect(null);
    }));
  }
});