Meteor.startup(function () {
  Meteor.subscribe('organizationInfo');
  return Meteor.subscribe('taskList', Meteor.userId());
});