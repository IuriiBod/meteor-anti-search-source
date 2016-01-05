Template.menuItemReport.onCreated(function() {
  this.getItemSalesQuantity = function() {
    return DailySales.findOne({menuItemId: this.data.item._id});
  };
});

Template.menuItemReport.helpers({
  itemSalesQuantity: function() {
    var menuItemDailySales = Template.instance().getItemSalesQuantity();
    return menuItemDailySales && menuItemDailySales.actualQuantity || 0;
  },
  itemTotalPriceFromSales: function() {
    var menuItemDailySales = Template.instance().getItemSalesQuantity();
    return menuItemDailySales && menuItemDailySales.actualQuantity * this.item.salesPrice || 0;
  },

});