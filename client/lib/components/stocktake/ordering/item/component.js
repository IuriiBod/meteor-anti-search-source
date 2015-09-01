var component = FlowComponents.define("ordersListItem", function(props) {
  this.orderId = props.itemId;
  this.onRendered(this.onItemRendered);
});

component.state.order = function() {
  var order = StockOrders.findOne(this.orderId);
  if(order) {
    var stock = Ingredients.findOne({"_id": order.stockId});
    if(stock) {
      order.stockName = stock.description;
    }
    if(!order.hasOwnProperty("countOrdered")) {
      order.countOrdered = 0;
    }
    return order;
  }
}

component.state.editable = function() {
  var order = StockOrders.findOne(this.orderId);
  if(order) {
    if(order.orderReceipt) {
      return false;
    } else {
      return true;
    }
  }
}

component.state.supplier = function() {
  return Session.get("activeSupplier");
}

component.prototype.onItemRendered = function() {
  $(".orderingCount").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var id = $(this).closest("tr").attr("data-id");
      $(this).closest("tr").next().find("a").click();
      Meteor.call("editOrderingCount", id, parseFloat(newValue), function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });
}