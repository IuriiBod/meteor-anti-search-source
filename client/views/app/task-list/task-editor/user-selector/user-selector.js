Template.userSelector.onRendered(function () {
  this.$('.user-selector').select2({
    placeholder: "Select users for assigning task"
  });
});


Template.userSelector.helpers({
  users: function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}});
  },

  isSelected: function () {
    var sharingIds = Template.parentData().task.sharingIds;
    if (sharingIds && sharingIds.length) {
      return sharingIds.indexOf(this._id) > -1;
    } else {
      return false;
    }
  }
});