Template.profileChangePassword.helpers({
  passwordPattern: function () {
    return HospoHero.regExp.toHtmlString(HospoHero.regExp.password);
  }
});

Template.profileChangePassword.events({
  'change input#confirm-password': function (event, tmpl) {
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

    if (!$(event.target)[0].checkValidity()) {
      return;
    }

    Accounts.changePassword($oldPassword.value,
      $newPassword.value, HospoHero.handleMethodResult(function () {
        HospoHero.info("Password has been changed");
      }));
  }
});