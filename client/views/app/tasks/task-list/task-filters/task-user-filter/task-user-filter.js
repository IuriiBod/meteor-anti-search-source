Template.taskUserFilter.onRendered(function () {
  this.$('.task-user-filter').select2({
    placeholder: 'Select user',
    allowClear: true,
    width: '225px'
  });
});


Template.taskUserFilter.helpers({
  users: function () {
    return Meteor.users.find({
      _id: {
        $ne: Meteor.userId()
      }
    }, {
      sort: {
        'profile.firstname': 1
      }
    });
  }
});


Template.taskUserFilter.events({
  'change .task-user-filter': function (event, tmpl) {
    var selectedUser = event.target.value;
    tmpl.data.onFilterChange(selectedUser);
  }
});