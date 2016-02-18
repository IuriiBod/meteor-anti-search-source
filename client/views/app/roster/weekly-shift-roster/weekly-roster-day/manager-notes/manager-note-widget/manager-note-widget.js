//Context: date (Date)

Template.managerNoteWidget.onCreated(function () {
  var self = this;
  var commentsSubscription;

  self.note = new ReactiveVar();

  self.subscribe('managerNote', self.data.date, HospoHero.getCurrentAreaId(), function onReady () {
    self.autorun(function () {
      var note = ManagerNotes.findOne({
        noteDate: self.data.date,
        'relations.areaId': HospoHero.getCurrentAreaId()
      });

      if (note) {
        self.note.set(note);
        commentsSubscription = Meteor.subscribe('comments', note._id, HospoHero.getCurrentAreaId());
      } else if (commentsSubscription) {
        self.note.set(null);
        commentsSubscription.stop();
      }
    });
  });

  self.isTextOfNoteChanged = new ReactiveVar(false);
});

Template.managerNoteWidget.helpers({
  note: function () {
    return Template.instance().note.get();
  },
  isTextOfNoteChanged: function () {
    return Template.instance().isTextOfNoteChanged.get();
  }
});

Template.managerNoteWidget.events({
  'keyup textarea[name=note-text]': function (event, tmpl) {
    var note = tmpl.note.get() || {text: ''};

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

    var note = tmpl.note.get() || {};
    note.text = text;

    if (!note._id) {
      note.noteDate = tmpl.data.date;
      note.createdAt = new Date();
      note.createdBy = Meteor.userId();
      note.relations = HospoHero.getRelationsObject();
    }

    Meteor.call('upsertManagerNote', note, HospoHero.handleMethodResult(function () {
      tmpl.isTextOfNoteChanged.set(false);
    }));
  },
  'click .cancel-changes': function (event, tmpl) {
    event.preventDefault();

    var note = tmpl.note.get() || {text: ''};

    tmpl.$('textarea[name=note-text]').val(note.text);
    tmpl.isTextOfNoteChanged.set(false);
  },
  'click .remove-note': function (event, tmpl) {
    event.preventDefault();

    var note = tmpl.note.get();
    if (!note) return;

    Meteor.call('deleteManagerNote', note._id);
  }
});