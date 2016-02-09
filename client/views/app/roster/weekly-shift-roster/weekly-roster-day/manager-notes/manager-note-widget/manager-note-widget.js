Template.managerNoteWidget.onCreated(function() {
  this.currentNote = new ReactiveVar(null);
});

Template.managerNoteWidget.helpers({
  currentNote: function() {
    return Template.instance().currentNote.get();
  },
  onCloseEditor: function() {
    var self = Template.instance();
    return function() {
      self.currentNote.set(null);
    }
  },
  notes: function () {
    return ManagerNotes.find({
      noteDate: this.date,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  },
  onEditNote: function() {
    var tmpl = Template.instance();
    return function(note) {
      tmpl.currentNote.set(note);
    }
  }
});

Template.managerNoteWidget.events({
  'click .create-note': function(event, tmpl) {
    event.preventDefault();

    tmpl.currentNote.set({
      noteDate: tmpl.data.date
    });
  }
});