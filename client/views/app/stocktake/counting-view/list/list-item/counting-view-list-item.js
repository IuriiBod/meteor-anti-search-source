Template.stockCountingListItem.onRendered(function() {
  this.$('[data-toggle="tooltip"]').tooltip();
});

Template.stockCountingListItem.helpers({
  ingredient: function() {
    if(this.ingredient) {
      return {
        inStock: Stocktakes.findOne({stockId: this.ingredient}),
        data: Ingredients.findOne({_id: this.ingredient})
      }
    }
    if(this.stocktakeItem) {
      return {
        inStock: this.stocktakeItem,
        data: Ingredients.findOne({_id: this.stocktakeItem.stockId})
      }
    }
  },

  canEditIngredientsItem: function(id) {
    var permitted = true;
    var stocktake = Stocktakes.findOne({_id: id});
    if (stocktake && stocktake.orderRef) {
      var order = StockOrders.findOne(stocktake.orderRef);
      permitted = order && order.orderReceipt;
    }
    return permitted;
  }
});
