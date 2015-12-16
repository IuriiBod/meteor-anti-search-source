Template.ordersListItem.helpers({
  order: function () {
    var order = StockOrders.findOne({_id: this.itemId});
    if (order) {
      var stock = Ingredients.findOne({_id: order.stockId});
      if (stock) {
        order.stockName = stock.description;
      }
      return order;
    }
  },

  editable: function() {
    var order = StockOrders.findOne({_id: this.itemId});
    if (order) {
      return !order.orderReceipt;
    }
  },

  onCountChange: function() {
    var currentData = Template.currentData();
    return function () {
      currentData.onCountChange();
    }
  }
});

Template.ordersListItem.events({
  'click .removeStockOrder': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var confirmDelete = confirm("Are you sure you want to delete this order ?");
    if (confirmDelete && id) {
      Meteor.call("removeOrder", id, HospoHero.handleMethodResult());
    }
  }
});
