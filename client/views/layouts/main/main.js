Template.mainLayout.events({
  'click .close-flyout-button': function (event) {
    let flyout = FlyoutManager.getInstanceByElement(event.target);
    return flyout.close();
  },

  'click .close-all-flyouts-button': function () {
    swal({
      title: 'Close all the flyouts?',
      text: 'You changes may be discarded.\nMake sure you\'ve saved them first.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ec4758',
      confirmButtonText: 'Yes, close',
      closeOnConfirm: true,
      html: false
    }, function () {
      FlyoutManager.removeAllFlyoutes();
    });
  }
});