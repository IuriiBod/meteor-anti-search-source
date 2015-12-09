Template.managerNotesEditor.onRendered(function () {
  this.$('textarea').focus();
});

Template.managerNotesEditor.events({
  'click .create-manager-note': function (event, tmpl) {
    var text = tmpl.$('textarea[name=noteText]').val().trim();
    if (!text) {
      return false;
    } else {
      var note = _.clone(tmpl.data.note);
      if (!note) {
        note = {
          noteDate: tmpl.data.date,
          createdAt: new Date(),
          createdBy: Meteor.userId(),
          relations: HospoHero.getRelationsObject()
        };
      }

      note.text = text;
      tmpl.data.onSubmit(note);
    }
  }
});