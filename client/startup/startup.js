Meteor.startup(function () {
  Meteor.subscribe('organizationInfo');
  Meteor.subscribe('taskList', Meteor.userId());
});