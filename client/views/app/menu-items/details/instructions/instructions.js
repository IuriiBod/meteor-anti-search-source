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
    var isEditMode = tmpl.get('isEditMode');

    var toggleEditMode = function () {
      tmpl.set('isEditMode', !isEditMode);
    };

    if (isEditMode) {
      var menuItem = MenuItems.findOne({_id: tmpl.data._id});
      menuItem.instructions = tmpl.$('.summernote').summernote('code');
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult(function () {
        toggleEditMode();
      }));
    } else {
      toggleEditMode();
    }
  }
});