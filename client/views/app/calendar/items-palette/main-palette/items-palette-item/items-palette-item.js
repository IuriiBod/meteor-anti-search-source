// context CalendarEvent Object

Template.itemsPaletteItem.helpers({
  title () {
    return HospoHero.calendar.getEventTitle(this);
  },

  style () {
    let eventSettings = HospoHero.calendar.getEventByType(this.type);
    let color = eventSettings.borderColor;

    return {
      style: `background-color: ${color}; border-color: ${color}`
    };
  }
});