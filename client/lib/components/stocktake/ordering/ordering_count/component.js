var component = FlowComponents.define("orderingCount", function(props) {
  this.id = props.id;
  this.unit = props.unit;
  this.onCountChange = props.onCountChange;
});

component.state.orderingCount = function() {
  var order = StockOrders.findOne(this.id);
  if(order) {
    return order.countOrdered;
  }
};

component.state.unit = function() {
  return this.unit;
};

component.action.countChange = function () {
  this.onCountChange();
};