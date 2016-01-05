Template.userSelector.onRendered(function () {
  this.$('.user-selector').select2();
});


Template.userSelector.helpers({
  users: function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}});
  }
});