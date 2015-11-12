Template.posMenuLinkingHeader.events({
  'click .update-pos-menu-items-button': function (event, tmpl) {
    FlowComponents.callAction('updatePosMenuItems');
  },
  'click .sync-sales-button': function (event, tmpl) {
    FlowComponents.callAction('syncActualSales');
  }
});
