//var component = FlowComponents.define("orderReceive", function (props) {
//  this.id = Router.current().params._id;
//});

//component.state.list = function () {
//  var data = StockOrders.find({"orderReceipt": this.id, "countOrdered": {$gt: 0}});
//  if (data) {
//    return data;
//  }
//};

//component.state.total = function () {
//  var orders = StockOrders.find({"orderReceipt": this.id}).fetch();
//  var cost = 0;
//  if (orders.length > 0) {
//    orders.forEach(function (order) {
//      cost += parseFloat(order.countOrdered) * parseFloat(order.unitPrice)
//    });
//  }
//  return cost;
//};
//
//component.state.receipt = function () {
//  var data = OrderReceipts.findOne(this.id);
//  if (data) {
//    return data;
//  }
//};

//component.state.isReceived = function () {
//  var data = OrderReceipts.findOne(this.id);
//  if (data) {
//    if (data.received) {
//      return true;
//    }
//  }
//};

//component.state.receivedNote = function () {
//  var receipt = OrderReceipts.findOne(this.id);
//  if (receipt) {
//    return receipt.receiveNote;
//  }
//};