Template.menuItemsRankReport.helpers({
  menuItems: function() {
    return MenuItems.find();
  },

  itemSalesQuantity: function(itemId) {
    var menuItemDailySales = DailySales.findOne({menuItemId: itemId});
    return menuItemDailySales && menuItemDailySales.actualQuantity || 0;
  }
});