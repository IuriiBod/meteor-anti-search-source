// context event: CalendarEvent Object

Template.eventMeeting.helpers({
  meeting() {
    return Meetings.findOne({
      _id: this.event.itemId
    });
  },

  goToItemTemplateData() {
    return {
      id: this.event.itemId
    };
  }
});