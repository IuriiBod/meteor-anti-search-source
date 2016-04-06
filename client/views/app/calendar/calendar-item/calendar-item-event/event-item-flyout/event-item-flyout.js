// context event: CalendarEvent Object
Template.eventItemFlyout.helpers({
  eventTitle () {
    return HospoHero.calendar.getEventTitle(this.event);
  }
});