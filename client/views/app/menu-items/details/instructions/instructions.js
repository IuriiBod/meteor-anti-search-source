Template.menuItemInstructions.helpers({
  instructionsStr() {
    return this.item.instructions || "Add instructions here";
  },

  saveChanges() {
    let self = this.item;
    return function (instructions) {
      let menuItem = MenuItems.findOne({_id: self._id});
      menuItem.instructions = instructions;
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
    }
  },

  instructionsOptions() {
    return {
      namespace: 'menus',
      type: 'instructions',
      name: 'Instructions'
    }
  }
});