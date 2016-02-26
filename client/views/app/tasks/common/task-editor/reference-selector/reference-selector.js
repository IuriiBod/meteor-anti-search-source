Template.referenceSelector.onRendered(function () {
  this.$('.reference-selector').select2({
    placeholder: "Select a reference",
    allowClear: true
  });
});


Template.referenceSelector.helpers({
  menuItems () {
    return MenuItems.find().fetch();
  },

  jobItems () {
    return JobItems.find().fetch();
  },

  suppliers () {
    return Suppliers.find().fetch();
  },

  meetings () {
    let userId = Meteor.userId();
    return Meetings.find({
      $or: [
        {attendees: userId},
        {createdBy: userId}
      ]
    }).fetch();
  }
});