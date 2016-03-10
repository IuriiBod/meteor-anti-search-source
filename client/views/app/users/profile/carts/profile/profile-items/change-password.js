Template.profileChangePassword.events({
    'change input#confirm-password': function (e,t) {
        var $password = t.find("#new-password");
        var $confirm = t.find("#confirm-password");

        if($password.value !== $confirm.value) {
            $confirm.setCustomValidity("Passwords don't match");
        } else {
            $confirm.setCustomValidity('');
        }
    },
    'submit form#change-password': function (event,t) {
        event.preventDefault();
        var $oldPassword = t.find("#old-password");
        var $newPassword = t.find("#new-password");

        if(!$(event.target)[0].checkValidity()) { return };

        Accounts.changePassword($oldPassword.value,
            $newPassword.value, HospoHero.handleMethodResult(function () {
                HospoHero.info("Password has been changed");
        }));
    }
});