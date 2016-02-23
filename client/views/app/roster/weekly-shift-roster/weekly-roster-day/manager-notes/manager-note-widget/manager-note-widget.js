//Context: date (Date)

Template.managerNoteWidget.onCreated(function () {
  let self = this;

  self.note = () => {
    return ManagerNotes.findOne({
      noteDate: self.data.date,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  };

  self.subscribe('managerNote', self.data.date, HospoHero.getCurrentAreaId(), function onReady () {
    let note = self.note();
    let noteId = note ? note._id : Meteor.call('insertEmptyManagerNote', self.data.date);

    commentsSubscription = Meteor.subscribe('comments', noteId, HospoHero.getCurrentAreaId());
  });

  self.textForEmptyEditor = 'Leave your note here';
});

Template.managerNoteWidget.helpers({
  note () {
    console.log(Template.instance().note());
    return Template.instance().note();
  },
  textOfNote () {
    let note = Template.instance().note();
    if (note && _.isString(note.text) && $.trim(note.text)) {
      return note.text;
    }
    let canUserEditRoster = HospoHero.canUser('edit roster', Meteor.userId());
    return canUserEditRoster ? Template.instance().textForEmptyEditor : 'No notes';
  },
  saveNote () {
    let tmpl = Template.instance();

    return (text) => {

      if (text === tmpl.textForEmptyEditor) return;

      let note = tmpl.note();
      note.text = text;

      if (!note.createdAt) {
        note.createdAt = new Date();
      }

      if (!note.createdBy) {
        note.createdBy = Meteor.userId();
      }

      Meteor.call('upsertManagerNote', note);
    }
  },
  readOnly () {
    return !HospoHero.canUser('edit roster', Meteor.userId());
  }
});