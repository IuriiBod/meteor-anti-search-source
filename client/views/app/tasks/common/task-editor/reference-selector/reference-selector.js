Template.referenceSelector.onRendered(function () {
  this.$('.reference-selector').select2({
    placeholder: "Select a reference",
    allowClear: true
  });
});


Template.referenceSelector.helpers({
  menuItems () {
    return MenuItems.find();
  },

  jobItems () {
    return JobItems.find();
  },

  suppliers () {
    return Suppliers.find();
  },

  meetings () {
    const userId = Meteor.userId();
    return Meetings.find({
      $or: [
        {attendees: userId},
        {createdBy: userId}
      ]
    });
  },

  projects () {
    const userId = Meteor.userId();
    return Projects.find({
      $or: [
        {lead: userId},
        {team: userId},
        {createdBy: userId}
      ]
    });
  },

  interviews () {
    let userId = Meteor.userId();
    return Interviews.find({
      $or: [
        {createdBy: userId},
        {interviewers: userId}
      ]
    });
  },

  ingredients () {
    return Ingredients.find();
  }
});