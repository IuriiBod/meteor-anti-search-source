Template.profileChangePassword.onCreated(function () {
  this.hasPassword = new ReactiveVar(true);
  Meteor.call('hasUserPassword', (err, res) => {
    if (!err) {
      this.hasPassword.set(res);
    }
  });
});

Template.profileChangePassword.helpers({
  passwordPattern() {
    return HospoHero.regExp.toHtmlString(HospoHero.regExp.password);
  },
  hasPassword() {
    return Template.instance().hasPassword.get();
  }
});

Template.profileChangePassword.events({
  'change input#confirm-password'(event, tmpl) {
    var $password = tmpl.find("#new-password");
    var $confirm = tmpl.find("#confirm-password");

    if ($password.value !== $confirm.value) {
      $confirm.setCustomValidity("Passwords don't match");
    } else {
      $confirm.setCustomValidity('');
    }
  },
  'submit form#change-password': function (event, tmpl) {
    event.preventDefault();
    var $oldPassword = tmpl.find("#old-password");
    var $newPassword = tmpl.find("#new-password");

    if (!event.target.checkValidity()) {
      return;
    }
    if(!HospoHero.regExp.password.test($newPassword.value)){
      HospoHero.error('Minimum required length: 8. Maximum - 16.');
      return;
    }
    if (tmpl.hasPassword.get()) {
      Accounts.changePassword($oldPassword.value, $newPassword.value,
        HospoHero.handleMethodResult(() => {
          HospoHero.info("Password has been changed.");
          event.target.reset();
        }));
    } else {
      Meteor.call('setUserPassword', $newPassword.value,
        HospoHero.handleMethodResult(() => {
          HospoHero.info("Password has been added.");
          Meteor.call('hasUserPassword', (err, res) => {
            if (!err) {
              tmpl.hasPassword.set(res);
            }
          });
          event.target.reset();
        }));
    }
  }
});
