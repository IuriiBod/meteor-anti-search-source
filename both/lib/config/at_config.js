//Fields
AccountsTemplates.addField({
  _id: 'firstname',
  type: 'text',
  displayName: 'First Name',
  required: true,
  minLength: 3,
  errStr: 'error.minChar',
  trim: true
});

AccountsTemplates.addField({
  _id: 'lastname',
  type: 'text',
  displayName: 'Last Name',
  required: true,
  minLength: 3,
  errStr: 'error.minChar',
  trim: true
});

AccountsTemplates.removeField('email');
AccountsTemplates.addField({
  _id: 'email',
  type: 'email',
  required: true,
  re: HospoHero.regExp.email,
  errStr: 'error.accounts.Invalid email',
  trim: true,
  lowercase: true
});

AccountsTemplates.addField({
  _id: "tel",
  type: "tel",
  displayName: "Phone number",
  required: false,
  errStr: 'error.minChar'
});

AccountsTemplates.addField({
  _id: "pinCode",
  type: "password",
  placeholder: "****",
  displayName: "PIN code",
  required: true,
  minLength: 4,
  re: HospoHero.regExp.pin,
  errStr: "Required four-digit PIN."
});

AccountsTemplates.removeField('password');
AccountsTemplates.addField({
  _id: 'password',
  type: 'password',
  required: true,
  minLength: 8,
  re:HospoHero.regExp.password,
  errStr: 'error.minChar'
});

/*
 AccountsTemplates.addField({
 _id: 'username_and_email',
 type: 'text',
 displayName: 'Name or Email',
 placeholder: 'name or email',
 });
 */


//Routes
// AccountsTemplates.configureRoute('signIn');
// AccountsTemplates.configureRoute('signUp', {
//   path: '/register'
// });
//AccountsTemplates.configureRoute('forgotPwd');
//AccountsTemplates.configureRoute('resetPwd');
//AccountsTemplates.configureRoute('changePwd');
//AccountsTemplates.configureRoute('enrollAccount');
//AccountsTemplates.configureRoute('verifyEmail');


// Options
AccountsTemplates.configure({
  enablePasswordChange: false,
  showForgotPasswordLink: true,
  confirmPassword: false,
  overrideLoginErrors: true,
  forbidClientAccountCreation: false,

  negativeFeedback: false,
  positiveFeedback: false,
  negativeValidation: true,
  positiveValidation: true,

  onSubmitHook: function (error, state) {
    if (!error && state === 'signIn') {
      var currentRouter = Router.current();

      if (currentRouter && currentRouter.params.query && currentRouter.params.query.backwardUrl) {
        var backwardUrl = currentRouter.params.query.backwardUrl;
        Meteor.setTimeout(function () {
          Router.go(backwardUrl);
        }, 1500);
      }
    }
  }
});

