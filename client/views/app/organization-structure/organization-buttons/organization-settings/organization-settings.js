Template.organizationDetailsPage.onCreated(function () {
});

Template.organizationDetailsPage.events({
  'click .delete-organization': function () {
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
    FlyoutManager.open('rolesSettings');
  },
  'click .open-inactivity-timeout-settings-flyout': function () {
    FlyoutManager.open('inactivityTimeoutField');
  },
  'click .open-archiving-settings-flyout': function () {
    FlyoutManager.open('locationAreaArchiving');
  }
});
