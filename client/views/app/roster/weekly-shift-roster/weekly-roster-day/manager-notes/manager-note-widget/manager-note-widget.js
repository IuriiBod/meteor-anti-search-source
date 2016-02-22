//Context: date (Date)

Template.managerNoteWidget.onCreated(function () {
  let self = this;

  self.note = new ReactiveVar();

  self.subscribe('managerNote', self.data.date, HospoHero.getCurrentAreaId(), function onReady () {
    self.autorun(() => {
      let note = ManagerNotes.findOne({
        noteDate: self.data.date,
        'relations.areaId': HospoHero.getCurrentAreaId()
      });

      if (note) {
        self.note.set(note);
      } else {
        self.note.set({text: 'Leave your note here'});
      }
    });
  });
});

Template.managerNoteWidget.helpers({
  note () {
    return Template.instance().note.get();
  },
  saveNote () {
    let tmpl = Template.instance();

    return (text) => {
      let note = tmpl.note.get();
      note.text = text;

      if (!note._id) {
        note.noteDate = tmpl.data.date;
        note.createdAt = new Date();
        note.createdBy = Meteor.userId();
        note.relations = HospoHero.getRelationsObject();
      }

      Meteor.call('upsertManagerNote', note);
    }
  },
  readOnly () {
    return !HospoHero.canUser('edit roster', Meteor.userId());
  }
});