Template.taskUserFilter.onRendered(function () {
  this.$('.task-user-filter').select2({});
});


Template.taskUserFilter.helpers({
  users: function () {
    return Meteor.users.find();
  }
});


Template.taskUserFilter.events({
  'change .task-user-filter': function (event, tmpl) {
    var selectedUser = event.target.value;
    tmpl.data.onFilterChange(selectedUser);
  }
});