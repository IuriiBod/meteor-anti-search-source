//context: MenuItem
Template.menuItemDetailedMainView.onCreated(function () {
  this.uiStatesManager = new UIStatesManager('menuItem');
});
Template.menuItemDetailedMainView.helpers({
  uiStatesManager() {
    return Template.instance().uiStatesManager;
  }
});