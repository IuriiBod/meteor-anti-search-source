Template.organizationDetailsPage.onCreated(function() {
});

Template.organizationDetailsPage.events({
  'click .delete-organization': function (e) {
    //e.preventDefault();
    //if(confirm("Are you sure, you want to delete this organization?")) {
    //  var id = Template.instance().data.organizationId;
    //  Meteor.call('deleteOrganization', id, HospoHero.handleMethodResult());
    //  $('.flyout-container').removeClass('show');
    //}
  },
  'click .change-billing-account-flyout': function () {
    FlyoutManager.open('changeBillingAccount');
  },
  'click .open-roles-settings-flyout': function () {
    FlyoutManager.open('wrapperFlyout', {
      title: 'Roles Settings',
      template: 'rolesSettings'
    });
  },
  'click .open-inactivity-timeout-settings-flyout': function () {
    FlyoutManager.open('wrapperFlyout', {
      title: 'Inactivity Timeout',
      template: 'inactivityTimeoutField'
    });
  },
  'click .open-archiving-settings-flyout': function () {
    FlyoutManager.open('wrapperFlyout', {
      title: 'Locations/Areas archiving',
      template: 'locationAreaArchiving'
    });
  }
});
