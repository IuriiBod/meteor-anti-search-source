//context:
//date

Template.managerNotes.onCreated(function () {
  this.set('displayEditor', false);
});


Template.managerNotes.helpers({
  notes: function () {
    return ManagerNotes.find({
      noteDate: this.date,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  },
  addManagerNote: function () {
    var tmpl = Template.instance();
    return function (noteObject) {
      Meteor.call('upsertManagerNote', noteObject, HospoHero.handleMethodResult(function () {
        tmpl.set('displayEditor', false);
      }));
    }
  }
});


Template.managerNotes.events({
  'click': function (event, tmpl) {
    // hide editor form, when user was clicked anywhere out of it
    var stayEditorOpened = _.reduce(['create-note-button', 'manager-notes-editor'], function (memo, className) {
      return memo || (
        $('.' + className).is(event.target) ||
        $('.' + className).has(event.target).length > 0
        );
    }, false);

    if (!stayEditorOpened) {
      tmpl.set('displayEditor', false);
    }
  },

  'click .create-note-button': function (event, tmpl) {
    tmpl.set('displayEditor', true);
  }
});
