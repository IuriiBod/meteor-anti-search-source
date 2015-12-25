Template.stockCountingListItem.onRendered(function() {
  this.$('[data-toggle="tooltip"]').tooltip();
});

Template.stockCountingListItem.helpers({
  ingredient: function() {
    if(this.ingredientId) {
      return {
        inStock: Stocktakes.findOne({stockId: this.ingredientId}),
        data: Ingredients.findOne({_id: this.ingredientId})
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
      var order = StockOrders.findOne({_id: stocktake.orderRef});
      permitted = order && order.orderReceipt;
    }
    return permitted;
  }
});
