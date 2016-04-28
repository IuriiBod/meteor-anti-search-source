Template.userSelector.onRendered(function () {
  this.$('.user-selector').select2({
    placeholder: "Select users for assigning task"
  });
});


Template.userSelector.helpers({
  users: function () {
    return Meteor.users.find({}, {
      sort: {
        'profile.fullName': 1
      }
    });
  },

  isSelected: function () {
    var assignedUsers = Template.parentData().task.assignedTo || [];
    return assignedUsers.indexOf(this._id) > -1;
  }
});