Template.applicationsListHeader.events({
  'click .open-form-settings'() {
    FlyoutManager.open('wrapperFlyout', {
      template: 'applicationFormSettings',
      title: "Recruitment Form"
    });
  }
});