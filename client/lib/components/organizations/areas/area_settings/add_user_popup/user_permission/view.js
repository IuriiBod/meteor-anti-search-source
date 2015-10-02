Template.userPermissions.events({
  'click .add-existing-user': function() {
    var role = $('select[name="userRole"]').val();
    FlowComponents.callAction('addUser', role);
  },

  'click .back-to-select-user': function() {
    FlowComponents.callAction('backToSelectUser');
  }
});