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
    const userId = Meteor.userId();
    return Meetings.find({
      $or: [
        {attendees: userId},
        {createdBy: userId}
      ]
    }).fetch();
  },

  projects () {
    const userId = Meteor.userId();
    return Projects.find({
      $or: [
        {lead: userId},
        {team: userId},
        {createdBy: userId}
      ]
    }).fetch();
  },

  interviews () {
    let userId = Meteor.userId();
    return Interviews.find({
      $or: [
        {createdBy: userId},
        {interviewers: userId}
      ]
    }).fetch();
  }
});