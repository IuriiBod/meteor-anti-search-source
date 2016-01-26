Template.CloseFlyoutButton.events({
  'click .close-flyout-button': function (event) {
    let flyout = FlyoutManager.getInstanceByElement(event.target);
    return flyout.close();
  }
});