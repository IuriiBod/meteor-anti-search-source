Template.signIn.events({
  'click #at-signUp': function (event) {
    event.preventDefault();
    Router.go("signUp");
  },
  'click #at-forgotPwd': function (event) {
    event.preventDefault();
    Router.go('forgotPassword');
  }
});