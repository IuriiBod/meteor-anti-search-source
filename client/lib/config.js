//enable push notification using raix:push package
Push.enabled(true);


//accounts config
Accounts.ui.config({
  requestPermissions: {
    google: ['email']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

//reCaptcha config
reCAPTCHA.config({
  sitekey: Meteor.settings.public.reCaptchaKey,
  theme: 'light', //OPTIONAL. <light|dark> Specifies the color theme of the widget
  type: 'image', //OPTIONAL. <audio|image> Specifies the type of captcha to serve
  size: 'normal' //OPTIONAL. <normal|compact> Specifies the type of captcha to serve
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


//stale session config
Meteor.startup(function () {
  StaleSession.onGetInactivityTimeout(function () {
    var area = HospoHero.getCurrentArea();
    return area && area.inactivityTimeout;
  });

  StaleSession.onSessionExpiration = function () {
    var userId = Meteor.userId();

    if (!userId) {
      return;
    }

    var routeName = Router.current().route.getName();
    var allowedRouters = ['pinLock', 'switchUser'];
    var isAllowedRouter = _.contains(allowedRouters, routeName);
    if (!isAllowedRouter) {
      var backwardUrl = HospoHero.misc.getBackwardUrl();

      let options = {};
      if (backwardUrl !== '/') {
        options.query = `backwardUrl=${backwardUrl}`;
      }

      Router.go('pinLock', {userId: userId}, options);
    }
  };


  Accounts.onLogin(function () {
    StaleSession.reset();
    Meteor.subscribe('organizationInfo');
    Meteor.subscribe('todayTasks');
  });
});