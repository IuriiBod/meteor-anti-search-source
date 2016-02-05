Template.eventItemFlyoutContent.helpers({
  eventContentTemplate: function () {
    var type = this.eventObject.item.type;
    var eventItem = HospoHero.calendar.getEventByType(type);
    return eventItem && eventItem.eventSettings && eventItem.eventSettings.flyoutTemplate;
  }
});