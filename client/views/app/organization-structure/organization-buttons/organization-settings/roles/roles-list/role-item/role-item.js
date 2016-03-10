Template.roleItem.onRendered(function () {
  var role = this.data.role;

  $('.editable-role-name').editable({
    type: "text",
    title: 'Edit role name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'click',
    success: function (response, newValue) {
      Meteor.call('editRole', role._id, {name: newValue}, HospoHero.handleMethodResult());
    }
  });
});

Template.roleItem.events({
  'click .delete-role': function (event, tmpl) {
    if (confirm('Are you sure to delete this role? All users with this role will be changed on Worker role.')) {
      Meteor.call('deleteRole', tmpl.data.role._id, HospoHero.handleMethodResult());
    }
  }
});