var eventContentTemplates = {
  'recurring job': 'eventRecurringJob'
};

Template.eventItemFlyoutContent.helpers({
  eventContentTemplate: function () {
    var type = this.eventObject.item.type;
    return eventContentTemplates.hasOwnProperty(type) ? eventContentTemplates[type] : '';
  }
});