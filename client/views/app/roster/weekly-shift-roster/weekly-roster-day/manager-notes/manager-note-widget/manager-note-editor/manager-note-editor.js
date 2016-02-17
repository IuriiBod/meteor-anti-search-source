Template.managerNoteEditor.onRendered(function () {
  this.$('textarea[name=note-text]').focus();
});

Template.managerNoteEditor.events({
  'click .close-manager-note-editor': function(event, tmpl) {
    event.preventDefault();
    tmpl.data.onCloseEditor();
  },
  'submit form': function(event, tmpl) {
    event.preventDefault();

    var note = tmpl.data.note;
    var text = tmpl.$('textarea[name=note-text]').val().trim();

    if (!text) return;
    note.text = text;

    if (!note._id) {
      note.createdAt = new Date();
      note.createdBy = Meteor.userId();
      note.relations = HospoHero.getRelationsObject();
    }

    Meteor.call('upsertManagerNote', note, HospoHero.handleMethodResult(function () {
      tmpl.data.onCloseEditor();
    }));
  },
  'click .remove-note': function(event, tmpl) {
    var note = tmpl.data.note;
    Meteor.call('deleteManagerNote', note._id, HospoHero.handleMethodResult(function () {
      tmpl.data.onCloseEditor();
    }));
  }
});
