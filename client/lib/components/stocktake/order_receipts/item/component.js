var component = FlowComponents.define("orderReceiptItem", function(props) {
  this.item = props.item;
  subs.subscribe("receiptOrders", this.item._id);
  this.onRendered(this.onItemRendered);
});

component.state.receipt = function() {
  return this.item;
}

component.state.orderedValue = function() {
  var cost = 0;
  var id = this.item._id;
  var orders = StockOrders.find({"orderReceipt": id}).fetch();
  if(orders.length > 0) {
    orders.forEach(function(order) {
      cost += parseFloat(order.countOrdered) * parseFloat(order.unitPrice)
    });
  }
  return cost;
}

component.prototype.onItemRendered = function() {
  $(".invoiceValue").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var id = $(this).closest("tr").attr("data-id");
      var info = {
        "invoiceFaceValue": parseFloat(newValue)
      }
      Meteor.call("receiptUpdate", id, info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });
}