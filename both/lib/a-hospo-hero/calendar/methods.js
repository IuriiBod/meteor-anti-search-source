Namespace('HospoHero.calendar', {
  /**
   * Returns event object by event type
   * @param eventType
   * @returns {Object|boolean}
   */
  getEventByType (eventType) {
    return this.events[eventType] || false;
  },

  getEventItem (event) {
    let eventSettings = HospoHero.calendar.getEventByType(event.type);
    let collection = Mongo.Collection.get(eventSettings.collection);
    return collection.findOne({_id: event.itemId});
  },

  getEventTitle (event) {
    let eventSettings = HospoHero.calendar.getEventByType(event.type);
    let eventItem = HospoHero.calendar.getEventItem(event);
    return eventItem && eventItem[eventSettings.titleField];
  }
});