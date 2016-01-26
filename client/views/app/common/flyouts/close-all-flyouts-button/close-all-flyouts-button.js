Template.CloseAllFlyoutsButton.events({
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
      FlyoutManager.closeAll();
    });
  }
});