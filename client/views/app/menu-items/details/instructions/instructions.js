Template.menuItemInstructions.onCreated(function () {
  this.set('isEditMode', false);
  this.instructionsSaved = new ReactiveVar(false);
  this.timeout = new ReactiveVar(null);
});

Template.menuItemInstructions.helpers({
  instructionsStr: function () {
    return this.instructions || "Add instructions here";
  },

  isInstructionSaved() {
    return Template.instance().instructionsSaved.get();
  }
});


Template.menuItemInstructions.events({
  'click .edit-close-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('isEditMode', !tmpl.get('isEditMode'));
  },

  'keyup .note-editor': function(event, tmpl) {
    event.preventDefault();
    let saveChanges = function () {
      var menuItem = MenuItems.findOne({_id: tmpl.data._id});
      menuItem.instructions = tmpl.$('.summernote').summernote('code');
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult(function () {
        console.log('it saved');
      }));
    };
    if (tmpl.timeout.get()) {
      Meteor.clearTimeout(tmpl.timeout.get());
      tmpl.timeout.set(Meteor.setTimeout(saveChanges, 3000));
    } else {
      tmpl.timeout.set(Meteor.setTimeout(saveChanges, 3000));
    }
  }
});