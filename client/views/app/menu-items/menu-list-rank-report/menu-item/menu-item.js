Template.menuItemReport.onRendered(function() {
  var rank = this.data.item.rank;
  var itemsTotalCount = this.data.itemsCount;

  if (rank && rank.length) {
    var itemRankValues = {};

    rank.forEach(function (item) {
      itemRankValues[item] = itemsTotalCount - item + 1;
    });

    this.$('.sparkline').sparkline(rank, {
      type: 'line',
      'width': 100,
      chartRangeMin: 0,
      chartRangeMax: rank && rank.length || 0,
      tooltipFormat: '<span style="color: {{color}}">&#9679;</span> {{y:itemRankValues}}</span>',
      tooltipValueLookups: {
        itemRankValues: itemRankValues
      }
    });
  }
});

Template.menuItemReport.helpers({
  item: function () {
    if (this.item.menuItemStats) {
      var item = this.item;
      return [
        item.name,
        'sparkline',
        item.index,
        item.menuItemStats.soldQuantity,
        '$' + item.salesPrice,
        '$' + item.menuItemStats.totalItemSales,
        '$' + item.menuItemStats.prepCost,
        '$' + item.menuItemStats.totalPrepCost,
        '$' + item.menuItemStats.ingredientCost,
        '$' + item.menuItemStats.totalIngCost,
        '$' + item.menuItemStats.tax,
        '$' + item.menuItemStats.contribution,
        '$' + item.menuItemStats.totalContribution
      ];
    }
  }
});