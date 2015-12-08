var component = FlowComponents.define('managerNotesEditor', function (props) {
  this.noteId = props.noteId;
  this.addManagerNote = props.onSubmit;
  this.date = props.date;
});

component.state.note = function () {
  return ManagerNotes.findOne({_id: this.noteId});
};

component.action.addManagerNote = function (text) {
  var note = this.get('note');
  if (!note) {
    note = {
      noteDate: this.date,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      relations: HospoHero.getRelationsObject()
    };
  }

  note.text = text;
  this.addManagerNote(note);
};