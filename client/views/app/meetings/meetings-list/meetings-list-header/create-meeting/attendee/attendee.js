Template.attendee.helpers({
  user() {
    return Meteor.users.findOne({_id: this.userId});
  }
});

Template.attendee.events({
  'click .search-user-info-content' (event, tmpl) {
    if (_.isFunction(tmpl.data.onUserRemove)) {
      tmpl.data.onUserRemove(this.user._id);
    }
  }
});