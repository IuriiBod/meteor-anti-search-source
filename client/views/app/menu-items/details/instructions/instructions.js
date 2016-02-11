Template.menuItemInstructions.helpers({
  instructionsStr() {
    return this.instructions || "Add instructions here";
  },

  saveChanges() {
    let self = this;
    return function (instructions) {
      let menuItem = MenuItems.findOne({_id: self._id});
      menuItem.instructions = instructions;
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
    }
  },

  instructionsOptions() {
    return {
      namespace: 'menus',
      uiStateId: 'instructions',
      title: 'Instructions'
    }
  },

  readOnly() {
    return !HospoHero.canUser(`edit menus`, Meteor.userId());
  }
});