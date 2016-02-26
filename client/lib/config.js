//enable push notification using raix:push package
Push.enabled(true);

//accounts config
Accounts.ui.config({
  requestPermissions: {
    google: ['email']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});


//x-editable config
$.fn.editable.defaults.mode = 'inline';

var datepickerDefaults = {
  autoclose: true,
  todayHighlight: true,
  calendarWeeks: true,
  weekStart: 1
};
_.extend($.fn.datepicker.defaults, datepickerDefaults);