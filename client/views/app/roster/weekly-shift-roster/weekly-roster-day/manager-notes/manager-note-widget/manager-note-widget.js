var canUserEditRoster = function () {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(null, `edit roster`);
};

//Context: date (Date)

Template.managerNoteWidget.onCreated(function () {
  let self = this;

  self.note = () => {
    return ManagerNotes.findOne({
      noteDate: self.data.date,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  };

  let weekRange = TimeRangeQueryBuilder.forWeek(self.data.date);

  self.subscribe('managerNotes', weekRange, HospoHero.getCurrentAreaId(), function onReady () {
    self.subscribe('comments', self.note()._id, HospoHero.getCurrentAreaId());
  });

  self.textForEmptyEditor = 'Leave your note here';
});

Template.managerNoteWidget.helpers({
  note () {
    return Template.instance().note();
  },
  textOfNote () {
    let note = Template.instance().note();
    if (note && _.isString(note.text) && $.trim(note.text)) {
      return note.text;
    }
    return canUserEditRoster() ? Template.instance().textForEmptyEditor : 'No notes';
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
    return !canUserEditRoster();
  }
});
