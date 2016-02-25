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

  instructionsSettings() {
    return {
      namespace: 'menus',
      uiStateId: 'instructions',
      title: 'Instructions',
      contentPadding: '20px'
    }
  },

  readOnly() {
    const checker = new HospoHero.security.PermissionChecker();
    return !checker.hasPermissionInArea(null, 'edit menus');
  }
});