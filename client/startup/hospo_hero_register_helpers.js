Meteor.startup(function () {
  var helpers = {
    dateUtils: [
      'timeFormat',
      'hours',
      'minutes',
      'timezones'
    ]
  };

  Object.keys(helpers).forEach(function (helperSection) {
    helpers[helperSection].forEach(function (helperName) {
      Template.registerHelper(helperName, HospoHero[helperSection][helperName]);
    });
  });
});