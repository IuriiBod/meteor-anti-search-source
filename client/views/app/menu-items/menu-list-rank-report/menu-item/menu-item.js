Template.menuItemReport.onRendered(function() {
  this.$('.sparkline').sparkline(this.data.rank, {
    type: 'line',
    width: 50});
});

Template.menuItemReport.helpers({
  itemData: function () {
    var menuItemStats = [this.name, 'sparkline', this.index,
      this.menuItemStats && this.menuItemStats.soldQuantity,
      '$' + this.salesPrice,
      '$' + (this.menuItemStats && this.menuItemStats.totalItemSales),
      '$' + (this.menuItemStats && this.menuItemStats.prepCost),
      '$' + (this.menuItemStats && this.menuItemStats.totalPrepCost),
      '$' + (this.menuItemStats && this.menuItemStats.ingredientCost),
      '$' + (this.menuItemStats && this.menuItemStats.totalIngCost),
      '$' + (this.menuItemStats && this.menuItemStats.tax),
      '$' + (this.menuItemStats && this.menuItemStats.contribution),
      '$' + (this.menuItemStats && this.menuItemStats.totalContribution)
    ];
    if (this.menuItemStats) {
      return menuItemStats;
    }
  }
});