Template.menuItemInstructions.onCreated(function () {
  this.set('isEditMode', false);
  this.instructionSaved = new ReactiveVar(false);
  this.timeout = new ReactiveVar(null);
  this.typingInstruction = new ReactiveVar(false);
  this.uiStatesManager = new UIStatesManager('menuItems');

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
  'click .activate-text-edit-mode': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('isEditMode', true);

    if (tmpl.typingInstruction.get()) {
      tmpl.typingInstruction.set(false);
    }
  },

  'click': function (event, tmpl) {
    if (tmpl.get('isEditMode'))
    tmpl.set('isEditMode', false);
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
  },

  'shown.bs.collapse #Instructions': _.throttle(function (event, tmpl) {
    tmpl.uiStatesManager.set('instructions', true);
  }, 1000),

  'hidden.bs.collapse #Instructions': _.throttle(function (event, tmpl) {
    tmpl.uiStatesManager.set('instructions', false);
  }, 1000)
});