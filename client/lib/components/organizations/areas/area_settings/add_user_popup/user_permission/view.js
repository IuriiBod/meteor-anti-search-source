Template.userPermissions.events({
  'click .add-existing-user': function() {
    FlowComponents.callAction('addUser');
  },

  'click .back-to-select-user': function() {
    FlowComponents.callAction('backToSelectUser');
  }
});