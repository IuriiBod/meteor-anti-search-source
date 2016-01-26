Template.eventRecurringJob.helpers({
  job: function () {
    var jobId = this.eventObject.item.itemId;
    return JobItems.findOne({_id: jobId});
  },

  sectionName: function (sectionId) {
    var section = Sections.findOne({_id: sectionId});
    return section && section.name || 'No section name';
  },

  onCheckToggle: function () {
    var tmplData = Template.currentData();
    return function (doneCheckListItems) {
      var eventObject = tmplData.eventObject.item;
      eventObject.doneCheckListItems = doneCheckListItems;
      Meteor.call('editCalendarEvent', eventObject, HospoHero.handleMethodResult());
    }
  }
});