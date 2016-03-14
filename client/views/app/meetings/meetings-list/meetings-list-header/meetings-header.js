Template.meetingsHeader.events({
  'click .create-new-meeting' () {
    FlyoutManager.open('wrapperFlyout', {
      template:'createMeeting',
      title:"Create Meeting",
      data: {}
    });
  }
});