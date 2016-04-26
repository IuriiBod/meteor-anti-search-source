var canUserEditRoster = function () {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(null, `edit roster`);
};

//Context: date (Date)

Template.managerNoteWidget.onCreated(function () {
  const area = HospoHero.getCurrentArea();

  this.note = () => ManagerNotes.findOne({
    noteDate: TimeRangeQueryBuilder.forDay(this.data.date, area.locationId),
    'relations.areaId': area._id
  });

  this.textForEmptyEditor = 'Leave your note here';
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

    return (text, onDataSaved) => {

      if (text === tmpl.textForEmptyEditor) {
        return;
      }

      let note = tmpl.note();

      note = Object.assign({
        updatedAt: new Date(),
        updatedBy: Meteor.userId()
      }, note, {
        text: text
      });

      Meteor.call('upsertManagerNote', note, HospoHero.handleMethodResult(() => onDataSaved()));
    };
  },

  readOnly () {
    return !canUserEditRoster();
  },
  
  commentsSettings () {
    return {
      namespace: 'weeklyRoster',
      uiStateId: 'dailyNoteComments',
      title: 'Comments',
      contentPadding: '20px'
    };
  }
});
