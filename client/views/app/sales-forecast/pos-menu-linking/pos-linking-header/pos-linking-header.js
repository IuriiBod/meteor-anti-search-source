Template.posMenuLinkingHeader.helpers({
  isSalesSynced: function () {
    return !MenuItems.findOne({isNotSyncedWithPos: true});
  }
});

Template.posMenuLinkingHeader.events({
  'click .update-pos-menu-items-button': function () {
    Meteor.call('updatePosMenuItems', HospoHero.handleMethodResult());
  },
  'click .sync-sales-button': function () {
    Meteor.call('synchronizeActualSales', HospoHero.handleMethodResult());
  }
});
