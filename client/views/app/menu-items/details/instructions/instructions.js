Template.menuItemInstructions.onCreated(function () {
  this.set('isEditMode', false);
  this.instructionSaved = new ReactiveVar(false);
  this.timeout = new ReactiveVar(null);
  this.typingInstruction = new ReactiveVar(false);

  this.setTimeout = (executeFunction, hasTimeout) => {
    if (hasTimeout) {
      Meteor.clearTimeout(this.timeout.get());
      this.timeout.set(Meteor.setTimeout(executeFunction, 1500));
    } else {
      this.timeout.set(Meteor.setTimeout(executeFunction, 1500));
    }
  }
});

Template.menuItemInstructions.helpers({
  instructionsStr: function () {
    return this.instructions || "Add instructions here";
  },

  instruction() {
    return {
      saved: Template.instance().instructionSaved.get(),
      typing: Template.instance().typingInstruction.get()
    }
  }
});


Template.menuItemInstructions.events({
  'click .edit-close-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('isEditMode', !tmpl.get('isEditMode'));

    if (tmpl.typingInstruction.get()) {
      tmpl.typingInstruction.set(false);
    }
  },

  'keyup .note-editor': function(event, tmpl) {
    event.preventDefault();
    tmpl.instructionSaved.set(false);
    tmpl.typingInstruction.set(true);

    let saveChanges = function () {
      var menuItem = MenuItems.findOne({_id: tmpl.data._id});
      menuItem.instructions = tmpl.$('.summernote').summernote('code');
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult(function () {
        tmpl.instructionSaved.set(true);
      }));
    };

    tmpl.timeout.get() ? tmpl.setTimeout(saveChanges, true) : tmpl.setTimeout(saveChanges());
  }
});