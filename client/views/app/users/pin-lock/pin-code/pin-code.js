Template.pinCode.onCreated(function () {
  this.showSessionExpiredAlert = (onPromptResult) => {
    let options = {
      title: 'Error!',
      text: 'Your session has expired, log in again.',
      type: "error",
      confirmButtonText: 'OK',
      closeOnConfirm: true
    };
    return sweetAlert(options, onPromptResult);
  };
});

Template.pinCode.onRendered(function () {
  this.$('input#pin-code').focus();
});

Template.pinCode.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();
    let backwardUrl = tmpl.data.backwardUrl || '/';
    let userId = tmpl.data.userId;
    let pinCode = tmpl.find('#pin-code').value;

    StaleSession.pinLockManager.loginWithPin(userId, pinCode, (error) => {
      if (error) {
        tmpl.showSessionExpiredAlert((isConfirmed) => {
          if (isConfirmed) {
            Router.go('signIn');
          }
        });
      } else {
        Router.go(backwardUrl);
      }
    });
  },

  'click #switch-user': function (event) {
    event.preventDefault();
    Router.go('switchUser');
  }
});