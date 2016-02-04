Template.forgotPassword.events({
  'click #at-signUp': function (event) {
    event.preventDefault();
    Router.go("signUp");
  }
});