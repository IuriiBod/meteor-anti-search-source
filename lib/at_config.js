//Fields
AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    displayName: 'Name',
    required: true,
    minLength: 3,
    errStr: 'error.minChar'
});

AccountsTemplates.removeField('email');
AccountsTemplates.addField({
    _id: 'email',
    type: 'email',
    required: true,
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'error.accounts.Invalid email',
    trim: true,
    lowercase: true
});

AccountsTemplates.addField({
    _id: "address",
    type: "text",
    displayName: "Address",
    required: false,
    errStr: 'error.minChar'
});

AccountsTemplates.addField({
    _id: "tel",
    type: "tel",
    displayName: "Phone number",
    required: false,
    errStr: 'error.minChar'
});

AccountsTemplates.addField({
    _id: "gender",
    type: "select",
    displayName: "Gender",
    select: [
        {
            text: "Male",
            value: "male",
        },
        {
            text: "Female",
            value: "female",
        }
    ]
});

AccountsTemplates.addField({
  _id: "pinCode",
  type: "password",
  placeholder: "****",
  displayName: "PIN code",
  required: true,
  minLength: 4,
  re: /^\d{4}$/,
  errStr: "Required four-digit PIN."
});

AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    required: true,
    minLength: 8,
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
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
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

    // Texts
    // texts: {
    //   button: {
    //       signUp: "Register Now!"
    //   },
    //   socialSignUp: "Register",
    //   socialIcons: {
    //       "meteor-developer": "fa fa-rocket"
    //   },
    //   title: {
    //       forgotPwd: "Recover Your Passwod"
    //   },
    // },
});

// hack to get signOut route not considered among previous paths
// if (Meteor.isClient) {
    // Meteor.startup(function(){
        // AccountsTemplates.knownRoutes.push('/sign-out');
    // });
// }

