CalendarEventsManager = class CalendarEventsManager {
  constructor() {}

  static insert(item, type, userId) {
    const area = HospoHero.getCurrentArea(Meteor.userId());

    // the user was added to the meeting
    let event = {
      itemId: item._id,
      startTime: item.startTime,
      endTime: item.endTime,
      type: type,
      userId: userId,
      locationId: area.locationId,
      areaId: area._id
    };

    Meteor.call('addCalendarEvent', event);
  }

  static update(itemId, updateObject) {
    CalendarEvents.find({itemId: itemId}).forEach((event) => {
      _.extend(event, updateObject);
      Meteor.call('editCalendarEvent', event);
    });
  }

  static remove(removeQuery) {
    CalendarEvents.remove(removeQuery);
  }
};