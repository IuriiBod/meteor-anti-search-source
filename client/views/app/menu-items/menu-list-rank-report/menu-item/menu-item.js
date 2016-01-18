Template.menuItemReport.onCreated(function() {
  this.getItemSalesQuantity = function() {
    return DailySales.findOne({menuItemId: this.data.item._id});
  };
});

Template.menuItemReport.onRendered(function() {
  this.$('.sparkline').sparkline([5,6,7,9,1,5,3], {
    type: 'line',
    width: 50});
});

Template.menuItemReport.helpers({
  itemSalesQuantity: function() {
    var menuItemDailySales = Template.instance().getItemSalesQuantity();
    return menuItemDailySales && menuItemDailySales.predictionQuantity || 0;
  },
  itemTotalPriceFromSales: function() {
    var menuItemDailySales = Template.instance().getItemSalesQuantity();
    return menuItemDailySales && menuItemDailySales.predictionQuantity * this.item.salesPrice || 0;
  },

  menuItemStats: function () {
    var menu = this.item;
    var round = function (value) {
      return HospoHero.misc.rounding(value);
    };

    var processMenuEntry = function (propertyName, predicate) {
      var entriesField = menu[propertyName];
      return _.isArray(entriesField) && round(_.reduce(entriesField, predicate, 0)) || 0;
    };

    var result = {
      totalIngCost: processMenuEntry('ingredients', function (total, ingredientEntry) {
        var ingredient = Ingredients.findOne({_id: ingredientEntry._id});
        var ingredientProps = HospoHero.analyze.ingredient(ingredient);
        total += ingredientProps.costPerPortionUsed * ingredientEntry.quantity;
        return total;
      }),

      totalPrepCost: processMenuEntry('jobItems', function (total, jobEntry) {
        var job = JobItems.findOne({_id: jobEntry._id});
        var jobItemProps = HospoHero.analyze.jobItem(job);
        total += jobItemProps.prepCostPerPortion * jobEntry.quantity;
        return total;
      }),

      tax: round(menu.salesPrice * 0.1)
    };

    result.contribution = round(menu.salesPrice - result.totalPrepCost - result.totalIngCost - result.tax);
    result.totalContribution = round(result.contribution * Template.instance().getItemSalesQuantity().predictionQuantity);
    console.log(result);
    return result;
  }
});