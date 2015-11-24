Template.addRole.events({
  'submit form': function (e) {
    e.preventDefault();
    var name = $(e.target.name).val();
    var permissionsCheckbox = $('[name="permissions"]:checked');
    if (permissionsCheckbox.length == 0) {
      return HospoHero.error("You must select at least one permission");
    }

    var actions = _.map(permissionsCheckbox, function (permissionInput) {
      return permissionInput.value;
    });

    FlowComponents.callAction('addRole', name, actions);
    e.target.reset();
  }
});