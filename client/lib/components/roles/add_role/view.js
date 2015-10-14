Template.addRole.events({
  'submit form': function(e) {
    e.preventDefault();
    var name = $(e.target.name).val();
    var permissionsCheckbox = $('[name="permissions"]:checked');
    if(permissionsCheckbox.length == 0) {
      return alert("You must select at least one permission");
    }
    
    var permissions = _.map(permissionsCheckbox, function(permissionInput) {
      return permissionInput.value;
    });

    var result = Roles.addRole(name, permissions);
    if(result) {
      e.target.reset();
    }
  }
});