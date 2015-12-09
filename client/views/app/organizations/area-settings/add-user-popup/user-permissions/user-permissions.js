Template.userPermissions.onCreated(function () {
  this.set('selectPermissions', this.data.selectPermissions);
});

Template.userPermissions.events({
  'click .add-existing-user': function (event, tmpl) {
    var roleId = $('select[name="userRole"]').val();

    var addedUserInfo = {
      userId: tmpl.data.selectedUser,
      areaId: tmpl.data.areaId,
      roleId: roleId
    };

    Meteor.call('addUserToArea', addedUserInfo, HospoHero.handleMethodResult());
    tmpl.set('selectPermissions', false);
  },

  'click .back-to-select-user': function (event, tmpl) {
    tmpl.set('selectPermissions', false);
  }
});