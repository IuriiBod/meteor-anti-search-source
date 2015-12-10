//note is stored in template context

Template.managerNoteItem.onCreated(function () {
  this.set('displayEditor', false);
});


Template.managerNoteItem.helpers({
  onSubmit: function () {
    var tmpl = Template.instance();
    return function (noteObject) {
      Meteor.call('upsertManagerNote', noteObject, HospoHero.handleMethodResult(function () {
        tmpl.set('displayEditor', false);
      }));
    }
  }
});

Template.managerNoteItem.events({
  'click .edit-note-item': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('displayEditor', true);
  },

  'click .delete-note-item': function (event, tmpl) {
    event.preventDefault();

    if (confirm('Really delete this note?')) {
      Meteor.call('deleteManagerNote', tmpl.data._id, HospoHero.handleMethodResult());
    }
  }
});
