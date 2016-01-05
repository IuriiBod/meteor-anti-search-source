Migrations.add({
  version: 45,
  name: "changed timestamps to date in OrderReceipts and StockOrders collections",
  up: function () {
    OrderReceipts.find().forEach(function (order) {
      if (order.date) {
        OrderReceipts.update({
          _id: order._id
        }, {
          $set: {
            date: new Date(parseInt(order.date))
          }
        });
      }

      if (order.expectedDeliveryDate) {
        OrderReceipts.update({
          _id: order._id
        }, {
          $set: {
            expectedDeliveryDate: new Date(parseInt(order.expectedDeliveryDate))
          }
        });
      }
    });

    StockOrders.find().forEach(function (item) {
      if (item.orderedOn) {
        StockOrders.update({
          _id: item._id
        }, {
          $set: {
            orderedOn: new Date(parseInt(item.orderedOn))
          }
        });
      }

      if (item.expectedDeliveryDate) {
        StockOrders.update({
          _id: item._id
        }, {
          $set: {
            expectedDeliveryDate: new Date(parseInt(item.expectedDeliveryDate))
          }
        });
      }
    });
  }
});