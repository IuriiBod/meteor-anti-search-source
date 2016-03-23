Template.attendee.onCreated(function () {
  this.subscribe('selectedUsersList', [this.data.userId]);
});


Template.attendee.helpers({
  user() {
    return Meteor.users.findOne({_id: this.userId});
  },

  onUserSelect () {
    return (user) => {
      this.onUserRemove(user._id);
    };
  }
});