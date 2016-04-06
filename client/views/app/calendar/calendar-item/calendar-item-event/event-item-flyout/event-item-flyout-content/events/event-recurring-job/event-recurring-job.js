// context event: CalendarEvent Object

Template.eventRecurringJob.onCreated(function () {
  let eventItem = this.data.event;

  this.job = () => {
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
      var eventObject = tmpl.data.event;
      eventObject.doneCheckListItems = doneCheckListItems;
      tmpl.checkedItems.set(doneCheckListItems);

      Meteor.call('editCalendarEvent', eventObject, HospoHero.handleMethodResult());
    };
  }
});