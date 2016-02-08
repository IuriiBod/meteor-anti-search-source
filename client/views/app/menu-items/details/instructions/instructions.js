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

  collapsed() {
    return this.uiStates.getUIState('instructions');
  }
});


Template.menuItemInstructions.events({
  'shown.bs.collapse #Instructions': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('instructions', true);
  }, 1000),

  'hidden.bs.collapse #Instructions': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('instructions', false);
  }, 1000)
});