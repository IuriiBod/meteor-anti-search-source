var component = FlowComponents.define("ordersReceiptsList", function(props) {});

component.state.list = function() {
  return OrderReceipts.find();
}