Meteor.methods({
  addCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!HospoHero.canUser('edit calendar', Meteor.userId())) {
      logger.error("User not permitted to add items onto calendar");
      throw new Meteor.Error(403, "User not permitted to add items onto calendar");
    } else {
      CalendarEvents.insert(eventObject);
    }
  },

  editCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!HospoHero.canUser('view calendar', Meteor.userId())) {
      logger.error("User not permitted to edit calendar items");
      throw new Meteor.Error(403, "User not permitted to edit calendar items");
    } else {
      CalendarEvents.update({_id: eventObject._id}, {$set: eventObject});
    }
  },

  removeCalendarEvent: function (eventObject) {
    check(eventObject, HospoHero.checkers.CalendarEventDocument);

    if (!HospoHero.canUser('edit calendar', Meteor.userId())) {
      logger.error("User not permitted to delete items from calendar");
      throw new Meteor.Error(403, "User not permitted to delete items from calendar");
    } else {
      CalendarEvents.remove({_id: eventObject._id});
    }
  }
});