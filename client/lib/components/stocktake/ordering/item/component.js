var component = FlowComponents.define("ordersListItem", function(props) {
  this.order = props.item;
  this.onRendered(this.onItemRendered);
});

component.state.order = function() {
  var stock = Ingredients.findOne({"_id": this.order.stockId});
  if(stock) {
    this.order.stockName = stock.description;
  }
  if(!this.order.hasOwnProperty("countOrdered")) {
    this.order.countOrdered = 0;
  }
  return this.order;
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
      Meteor.call("editOrderingCount", id, parseFloat(newValue), function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });
}