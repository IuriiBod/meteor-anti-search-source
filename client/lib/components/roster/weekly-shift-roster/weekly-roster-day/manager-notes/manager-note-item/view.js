Template.managerNoteItem.events({
  'click .edit-note-item': function (event) {
    event.preventDefault();
    FlowComponents.callAction('toggleManagerNotesEditor', true);
  },

  'click .delete-note-item': function (event, tmpl) {
    event.preventDefault();

    if (confirm('Really delete this note?')) {
      FlowComponents.callAction('deleteManagerNote');
    }
  }
});