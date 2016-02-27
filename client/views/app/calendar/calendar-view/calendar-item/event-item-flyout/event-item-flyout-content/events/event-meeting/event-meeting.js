Template.eventMeeting.helpers({
  meeting() {
    return Meetings.findOne({
      _id: this.eventObject.item.itemId
    });
  },

  goToItemTemplateData() {
    return {
      id: this.eventObject.item.itemId
    }
  }
});