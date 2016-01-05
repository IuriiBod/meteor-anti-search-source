Migrations.add({
  version: 47,
  name: "changed timestamps to date in OrderReceipts and StockOrders collections",
  up: function () {
    var orderReceiptsDates = {};
    var stockOrdersDates = {};

    OrderReceipts.find().forEach(function (order) {
      if (order.date) {
        orderReceiptsDates.date = new Date(parseInt(order.date));
      }

      if (order.expectedDeliveryDate) {
        orderReceiptsDates.expectedDeliveryDate = new Date(parseInt(order.expectedDeliveryDate));
      }

      OrderReceipts.update({
        _id: order._id
      }, {
        $set: orderReceiptsDates
      });
    });

    StockOrders.find().forEach(function (item) {
      if (item.orderedOn) {
        stockOrdersDates.orderedOn = new Date(parseInt(item.orderedOn));
      }

      if (item.expectedDeliveryDate) {
        stockOrdersDates.expectedDeliveryDate = new Date(parseInt(item.expectedDeliveryDate));
      }

      StockOrders.update({
        _id: item._id
      }, {
        $set: stockOrdersDates
      });
    });
  }
});