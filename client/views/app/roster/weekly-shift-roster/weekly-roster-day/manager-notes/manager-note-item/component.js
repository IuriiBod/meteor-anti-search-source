var component = FlowComponents.define('managerNoteItem', function (props) {
  this.set('note', props.note);
  this.set('displayEditor', false);
});

component.state.onSubmit = function () {
  var self = this;
  return function (noteObject) {
    Meteor.call('upsertManagerNote', noteObject, HospoHero.handleMethodResult(function () {
      self.set('displayEditor', false);
    }));
  }
};

component.action.toggleManagerNotesEditor = function (displayState) {
  this.set('displayEditor', displayState);
};

component.action.deleteManagerNote = function () {
  Meteor.call('deleteManagerNote', this.get('note')._id, HospoHero.handleMethodResult());
};