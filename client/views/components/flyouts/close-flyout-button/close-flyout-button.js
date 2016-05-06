Template.CloseFlyoutButton.onCreated(function () {
  this.isRendered = new ReactiveVar(false);
});


Template.CloseFlyoutButton.onRendered(function () {
  let flyoutElement = this.$('.close-flyout-button')[0];
  this.currentFlyout = FlyoutManager.getInstanceByElement(flyoutElement);
  this.isRendered.set(true);
});


Template.CloseFlyoutButton.helpers({
  isTopBackFlyout: function () {
    let tmpl = Template.instance();

    //provides helper's reactiveness before rendering
    tmpl.isRendered.get();
    
    let flyout = tmpl.currentFlyout;
    return flyout && flyout.isTopBack();
  }
});


Template.CloseFlyoutButton.events({
  'click .close-flyout-button': function (event, tmpl) {
    if (tmpl.currentFlyout.isTopBack()) {
      FlyoutManager.closeAll();
    } else {
      tmpl.currentFlyout.close();
    }
  }
});