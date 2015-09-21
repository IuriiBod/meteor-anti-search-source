Template.permissionsList.onRendered(function() {
  var roleId = FlowComponents.callAction('getRoleId');
  roleId = roleId._result;
  $('#'+roleId+'-editable').editable({
    type: "checklist",
    title: 'Edit role permissions',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'click',
    source: Roles.getPermissions(),
    value: Roles.getPermissionsById(roleId),
    success: function(response, newValue) {
      var id = $(this).attr("data-id");
      if(id) {
        Roles.editRole(id, {permissions: newValue});
      }
    }
  });
});
