Template.roleItem.events({
  'click .delete-role': function(e) {
    if (confirm('Are you sure to delete this role? All users with this role will be changed on Worker role.')) {
      FlowComponents.callAction('deleteRole');
    }
  }
});

Template.roleItem.onRendered(function() {
  var role = FlowComponents.callAction('getRole')._result;

  $('.editable-role-name').editable({
    type: "text",
    title: 'Edit role name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'click',
    success: function(response, newValue) {
      Meteor.call('editRole', role._id, {name: newValue}, HospoHero.handleMethodResult());
    }
  });
});