Meteor.startup(function() {
  return Meteor.subscribe('organizationInfo');
});