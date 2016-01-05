Template.menuItemReport.onCreated(function() {
  console.log(this.data);
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

  prepItem: function() {
    var menu = this.item;

    var round = function (value) {
      return HospoHero.misc.rounding(value);
    };

    var processMenuEntry = function (propertyName, predicate) {
      var entriesField = menu[propertyName];
      return _.isArray(entriesField) && round(_.reduce(entriesField, predicate, 0)) || 0;
    };

    menu.jobItems.forEach(function(item) {
      var job = JobItems.findOne({_id: item._id});
      console.log(job);
    });

    var prepCostPerItem = processMenuEntry('jobItems', function (total, jobEntry) {
      var job = JobItems.findOne({_id: jobEntry._id});
      var jobItemProps = HospoHero.analyze.jobItem(job);
      total += jobItemProps.prepCostPerPortion * jobEntry.quantity;
      return total;
    });

    console.log('prepCostPerItem -> ', prepCostPerItem);
    return prepCostPerItem;
  }
});