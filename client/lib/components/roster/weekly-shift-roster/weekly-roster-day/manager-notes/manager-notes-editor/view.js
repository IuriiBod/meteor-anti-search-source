Template.managerNotesEditor.onRendered(function() {
  this.$('textarea').focus();
});

Template.managerNotesEditor.events({
  'click .create-manager-note': function(event, tmpl) {
    var text = tmpl.$('textarea[name=noteText]').val().trim();
    if(!text) {
      return false;
    } else {
      FlowComponents.callAction('addManagerNote', text);
    }
  }
});