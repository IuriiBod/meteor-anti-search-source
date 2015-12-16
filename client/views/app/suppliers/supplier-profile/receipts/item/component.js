var component = FlowComponents.define("receiptItem", function (props) {
  this.receipt = props.receipt;
});

component.state.receipt = function () {
  return this.receipt;
}

component.state.received = function () {
  var receipt = this.receipt;
  if (receipt) {
    if (receipt.received) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.pending = function () {
  var receipt = this.receipt;
  if (receipt) {
    if (!receipt.received) {
      if (receipt.hasOwnProperty("orderPlacedBy")) {
        return true;
      }
    }
  }
}