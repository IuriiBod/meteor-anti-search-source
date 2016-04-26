Template.menuItemInstructions.helpers({
  instructionsStr() {
    return this.instructions || "Add instructions here";
  },

  onSaveInstructions() {
    let self = this;
    return function (instructions, onDataSaved) {
      let menuItem = MenuItems.findOne({_id: self._id});
      menuItem.instructions = instructions;
      Meteor.call('editMenuItem', menuItem, HospoHero.handleMethodResult(() => onDataSaved()));
    };
  },

  instructionsSettings() {
    return {
      namespace: 'menus',
      uiStateId: 'instructions',
      title: 'Instructions',
      contentPadding: '20px'
    };
  },

  readOnly() {
    const checker = new HospoHero.security.PermissionChecker();
    return !checker.hasPermissionInArea(null, 'edit menus');
  }
});