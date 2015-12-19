Template.menuItemInstructions.onCreated(function () {
  this.set('isEditMode', false);
});


Template.menuItemInstructions.helpers({
  instructionsStr: function () {
    return this.instructions || "Add instructions here";
  }
});


Template.menuItemInstructions.events({
  'click .edit-save-button': function (event, tmpl) {
    event.preventDefault();
    var isEditMode = this.get('isEditMode');

    var toggleEditMode = function () {
      tmpl.set('isEditMode', !isEditMode);
    };

    if (isEditMode) {
      var info = {};
      info.instructions = tmpl.$('.summernote').summernote('code');
      Meteor.call("editMenuItem", tmpl.data._id, info, HospoHero.handleMethodResult(function () {
        toggleEditMode();
      }));
    } else {
      toggleEditMode();
    }
  }
});