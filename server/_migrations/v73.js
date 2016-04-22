Migrations.add({
  version: 73,
  name: "Update manager notes",
  up: function () {
    updateNamesFields();

    Areas.find().forEach((area) => {
      setDatesOfNotesToStartDay(area.locationId);
      combineNotesWithSameDate(area._id);
    });
  }
});

function updateNamesFields() {
  ManagerNotes.update({}, {
    $rename: {'createdAt': 'updatedAt', 'createdBy': 'updatedBy'}
  }, {
    multi: true
  });
}

function setDatesOfNotesToStartDay(locationId) {
  const notes = ManagerNotes.find();
  notes.forEach((note) => {
    ManagerNotes.update({
      _id: note._id
    }, {
      $set: {
        noteDate: HospoHero.dateUtils.getDateMomentForLocation(note.noteDate, locationId).startOf('day').toDate()
      }
    });
  });
}

function combineNotesWithSameDate(areaId) {
  let dayNote = null;
  const checkedNotes = [];

  const sortedNotes = ManagerNotes.find({
    'relations.areaId': areaId
  }, {
    sort: {noteDate: 1}
  });

  sortedNotes.forEach((note) => {
    if (dayNote !== null && moment(dayNote.noteDate).isSame(note.noteDate)) {

      if (note.text && note.text.length > 0) {
        const newText = dayNote.text && dayNote.text.length > 0 ? `${dayNote.text}<br>${note.text}` : note.text;

        dayNote = Object.assign(note, dayNote, {text: newText});
        const dayNoteCopy = Object.assign({}, dayNote);
        delete dayNoteCopy._id;

        ManagerNotes.update({
          _id: dayNote._id
        }, {
          $set: dayNoteCopy
        });
      }

    } else {
      checkedNotes.push(note._id);
      dayNote = note;
    }
  });

  ManagerNotes.remove({_id: {$nin: checkedNotes}, 'relations.areaId': areaId});
}