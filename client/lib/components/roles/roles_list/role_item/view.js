Template.roleItem.events({
  'click .delete-role': function(e) {
    Roles.deleteRole(e.target.dataset.id);
  }
});

Template.roleItem.onRendered(function() {
  $('.editable-role-name').editable({
    type: "text",
    title: 'Edit role name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'click',
    success: function(response, newValue) {
      var id = $(this).attr("data-id");
      if(id) {
        Roles.editRole(id, {name: newValue});
      }
    }
  });
});