Template.eventRecurringJob.onCreated(function () {
  var eventItem = this.data.eventObject.item;
  this.job = function () {
    var jobId = eventItem.itemId;
    return JobItems.findOne({_id: jobId});
  };

  this.checkedItems = new ReactiveVar(eventItem.doneCheckListItems || []);
});

Template.eventRecurringJob.helpers({
  job: function () {
    return Template.instance().job();
  },

  sectionName: function (sectionId) {
    var section = Sections.findOne({_id: sectionId});
    return section && section.name || 'No section name';
  },

  checklist: function () {
    var job = Template.instance().job();
    return job.checklist || [];
  },

  checkedItems: function () {
    return Template.instance().checkedItems.get();
  },

  onCheckToggle: function () {
    var tmpl = Template.instance();

    return function (doneCheckListItems) {
      var eventObject = tmpl.data.eventObject.item;
      eventObject.doneCheckListItems = doneCheckListItems;
      tmpl.checkedItems.set(doneCheckListItems);

      Meteor.call('editCalendarEvent', eventObject, HospoHero.handleMethodResult());
    };
  }
});