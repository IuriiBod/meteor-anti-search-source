Template.permissionsList.onRendered(function () {
  var role = this.data.role;

  $('#' + role._id + '-editable').editable({
    type: "checklist",
    title: 'Edit role permissions',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'click',
    source: HospoHero.roles.getActions(),
    value: role.actions,
    success: function (response, newValue) {
      Meteor.call('editRole', role._id, {actions: newValue}, HospoHero.handleMethodResult());
    }
  });
});