//Context: date (Date)

Template.managerNoteWidget.onCreated(function () {
  this.subscribe('managerNote', this.data.date, HospoHero.getCurrentAreaId());
  this.note = function () {
    return ManagerNotes.findOne({
      noteDate: this.data.date,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  };
  this.isTextOfNoteChanged = new ReactiveVar(false);
});

Template.managerNoteWidget.helpers({
  note: function () {
    return Template.instance().note();
  },
  isTextOfNoteChanged: function () {
    return Template.instance().isTextOfNoteChanged.get();
  }
});

Template.managerNoteWidget.events({
  'keyup textarea[name=note-text]': function (event, tmpl) {
    var note = tmpl.note() || {text: ''};

    if (note.text !== event.target.value) {
      tmpl.isTextOfNoteChanged.set(true);
    } else {
      tmpl.isTextOfNoteChanged.set(false);
    }
  },
  'submit form': function(event, tmpl) {
    event.preventDefault();

    var text = tmpl.$('textarea[name=note-text]').val();
    if (!text) return;

    var note = tmpl.note() || {};
    note.text = text;

    if (!note._id) {
      note.noteDate = tmpl.data.date;
      note.createdAt = new Date();
      note.createdBy = Meteor.userId();
      note.relations = HospoHero.getRelationsObject();
    }

    Meteor.call('upsertManagerNote', note);
    tmpl.isTextOfNoteChanged.set(false);
  },
  'click .cancel-changes': function (event, tmpl) {
    event.preventDefault();

    var note = tmpl.note() || {text: ''};

    tmpl.$('textarea[name=note-text]').val(note.text);
    tmpl.isTextOfNoteChanged.set(false);
  },
  'click .remove-note': function (event, tmpl) {
    event.preventDefault();

    var note = tmpl.note();
    if (!note) return;

    Meteor.call('deleteManagerNote', note._id);
  }
});