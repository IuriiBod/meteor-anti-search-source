Meteor.startup(function () {
  Meteor.subscribe('organizationInfo');
  Meteor.subscribe('todayTasks');
});