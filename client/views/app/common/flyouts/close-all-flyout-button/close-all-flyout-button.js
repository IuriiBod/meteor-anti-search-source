Template.closeAllFlyoutButton.events({
  'click .close-flyout-button': function (event,tmpl) {
    FlyoutManager.closeAll();
  }
});