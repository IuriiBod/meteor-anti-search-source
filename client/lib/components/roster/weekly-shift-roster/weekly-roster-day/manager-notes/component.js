var component = FlowComponents.define('managerNotes', function (props) {
  this.set('date', props.date);
  this.set('noteId', null);
  this.set('displayEditor', false);
});

component.state.notes = function () {
  return ManagerNotes.find({
    noteDate: this.get('date'),
    'relations.areaId': HospoHero.getCurrentAreaId()
  });
};

component.state.addManagerNote = function () {
  var self = this;
  return function(noteObject) {
    Meteor.call('upsertManagerNote', noteObject, HospoHero.handleMethodResult(function() {
      self.set('displayEditor', false);
    }));
  }
};

component.action.changeNoteId = function (noteId) {
  this.set('noteId', noteId);
};

component.action.toggleManagerNotesEditor = function (displayState) {
  this.set('displayEditor', displayState);
};