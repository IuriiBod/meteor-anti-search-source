//accounts config
Accounts.ui.config({
  requestPermissions: {
    google: ['email']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

//x-editable config
$.fn.editable.defaults.mode = 'inline';
