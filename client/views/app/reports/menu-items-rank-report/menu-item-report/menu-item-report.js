Template.menuItemReport.onCreated(function () {
  this.round = function (value) {
    return HospoHero.misc.rounding(value);
  }
});

Template.menuItemReport.onRendered(function() {
  var itemWeeklyRanks = this.data.item.weeklyRanks;
  var itemsTotalCount = this.data.itemsCount;

  if (itemWeeklyRanks && itemWeeklyRanks.length) {
    var itemRankValues = {};

    itemWeeklyRanks.forEach(function (item) {
      itemRankValues[item] = itemsTotalCount - item + 1;
    });

    this.$('.sparkline').sparkline(itemWeeklyRanks, {
      type: 'line',
      'width': 100,
      chartRangeMin: 0,
      chartRangeMax: itemWeeklyRanks && itemWeeklyRanks.length || 0,
      tooltipFormat: '<span style="color: {{color}}">&#9679;</span> {{y:itemRankValues}}</span>',
      tooltipValueLookups: {
        itemRankValues: itemRankValues
      }
    });
  }
});

Template.menuItemReport.helpers({
  item: function () {
    var item = this.item;
    var itemSalesQuantity = item.stats.soldQuantity;
    var instance = Template.instance();
    return [
      item.name, 'sparkline', item.index, itemSalesQuantity,
      '$' + item.salesPrice,
      '$' + instance.round(item.salesPrice * itemSalesQuantity),
      '$' + item.stats.prepCost,
      '$' + instance.round(item.stats.prepCost * itemSalesQuantity),
      '$' + item.stats.ingCost,
      '$' + instance.round(item.stats.ingCost * itemSalesQuantity),
      '$' + item.stats.tax,
      '$' + item.stats.contribution,
      '$' + item.stats.totalContribution
    ];
  }
});