Template.posMenuLinkingHeader.helpers({
  syncSalesWaitButtonConfig() {
    let isSynced = !MenuItems.findOne({isNotSyncedWithPos: true});
    let statusClassName = isSynced ? 'white-bg' : 'btn-primary';
    return {
      classNames: `btn ${statusClassName} sync-sales-button`,
      text: isSynced ? 'Sales are synced' : 'Sync sales'
    };
  }
});

Template.posMenuLinkingHeader.events({
  'click .update-pos-menu-items-button': function (event) {
    Meteor.call('updatePosMenuItems', Template.waitButton.handleMethodResult(event));
  },

  'click .sync-sales-button': function (event) {
    Meteor.call('synchronizeActualSales', Template.waitButton.handleMethodResult(event));
  }
});
