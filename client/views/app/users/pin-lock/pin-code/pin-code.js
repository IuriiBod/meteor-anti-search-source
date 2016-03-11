Template.pinCode.onRendered(function () {
  this.$('input#pin-code').focus();
});

Template.pinCode.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();
    var backwardUrl = tmpl.data.backwardUrl || '/';
    var userId = tmpl.data.userId;
    var pinCode = tmpl.find('#pin-code').value;

    StaleSession.pinLockManager.loginWithPin(userId, pinCode, HospoHero.handleMethodResult(function () {
      Router.go(backwardUrl);
    }));
  },

  'click #switch-user': function (event) {
    event.preventDefault();
    Router.go('switchUser');
  }
});