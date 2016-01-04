Template.menuItemReport.helpers({
  itemSalesQuantity: function(itemId) {
    var menuItemDailySales = DailySales.findOne({menuItemId: itemId});
    return menuItemDailySales && menuItemDailySales.actualQuantity || 0;
  },


});