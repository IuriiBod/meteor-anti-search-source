Template.managerNotes.events({
  // hide editor form, when user was clicked anywhere out of it
  // TODO: Make the same thing for flyouts??
  'click': function(event) {
    var stayEditorOpened = _.reduce(['create-note-button', 'manager-notes-editor'], function(memo, className) {
      return memo || (
              $('.' + className).is(event.target) ||
              $('.' + className).has(event.target).length > 0
        );
    }, false);

    if(!stayEditorOpened) {
      FlowComponents.callAction('toggleManagerNotesEditor', false);
    }
  },

  'click .create-note-button': function() {
    FlowComponents.callAction('toggleManagerNotesEditor', true);
  }
});