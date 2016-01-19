Template.menuItemReport.onCreated(function() {
  this.getItemSalesQuantity = function() {
    return DailySales.findOne({menuItemId: this.data.item._id});
  };
});

Template.menuItemReport.onRendered(function() {
  this.$('.sparkline').sparkline(this.data.item.rank, {
    type: 'line',
    width: 50});
});

Template.menuItemReport.helpers({
  itemSalesQuantity: function() {
    var menuItemDailySales = Template.instance().getItemSalesQuantity();
    if (menuItemDailySales) {
      return menuItemDailySales.actualQuantity || menuItemDailySales.predictionQuantity || 0;
    }
  },
  itemTotalPriceFromSales: function() {
    var menuItemDailySales = Template.instance().getItemSalesQuantity();
    if (menuItemDailySales) {
      return this.item.salesPrice * (menuItemDailySales.actualQuantity || menuItemDailySales.predictionQuantity) || 0;
    }
  },

  menuItemStats: function () {
    var menuItem = this.item;
    var menuItemDailySales = Template.instance().getItemSalesQuantity();

    if (menuItemDailySales) {
      var round = function (value) {
        return HospoHero.misc.rounding(value);
      };

      var result = HospoHero.analyze.menuItem(menuItem);

      result.totalContribution = round(result.contribution * (menuItemDailySales.actualQuantity || menuItemDailySales.predictionQuantity));

      return result;
    }
  }
});