Template.eventMeeting.helpers({
  meeting() {
    return Meetings.findOne({
      _id: this.eventObject.item.itemId
    });
  }
});