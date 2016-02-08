Template.managerNoteWidget.onCreated(function() {
  this.isNoteEditing = new ReactiveVar(false);
});

Template.managerNoteWidget.helpers({
  isNoteEditing: function() {
    return Template.instance().isNoteEditing.get();
  }
});

Template.managerNoteWidget.events({
  'click .create-note': function(event, tmpl) {
    event.preventDefault();
    tmpl.isNoteEditing.set(true);
  }
});