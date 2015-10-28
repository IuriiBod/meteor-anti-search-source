Meteor.startup(function () {
  Object.keys(HospoHero.dateUtils).forEach(function (helper) {
    Template.registerHelper(helper, HospoHero.dateUtils[helper]);
  });
});