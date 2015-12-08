Meteor.startup(function () {
  return [Meteor.subscribe('organizationInfo'), Meteor.subscribe('userAllUnavailabilities')];
});