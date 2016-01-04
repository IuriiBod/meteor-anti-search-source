Migrations.add({
  version: 45,
  name: "changed timestamps to date in OrderReceipts and StockOrders collections",
  up: function () {
    OrderReceipts.find().forEach(function (order) {
      if (order.date && _.isString(order.date)) {
        OrderReceipts.update({_id: order._id}, {
          $set: {
            date: new Date(Number(order.date))
          }
        });
      } else if (order.date && _.isNumber(order.date)) {
        OrderReceipts.update({_id: order._id}, {
          $set: {
            date: new Date(order.date)
          }
        });
      }

      if (order.expectedDeliveryDate && _.isString(order.expectedDeliveryDate)) {
        OrderReceipts.update({_id: order._id}, {
          $set: {
            expectedDeliveryDate: new Date(Number(order.expectedDeliveryDate))
          }
        });
      } else if (order.expectedDeliveryDate && _.isNumber(order.expectedDeliveryDate)) {
        OrderReceipts.update({_id: order._id}, {
          $set: {
            expectedDeliveryDate: new Date(order.expectedDeliveryDate)
          }
        });
      }
    });

    StockOrders.find().forEach(function(item) {
      if (item.orderedOn && _.isString(item.orderedOn)) {
        StockOrders.update({_id: item._id}, {
          $set: {
            orderedOn: new Date(Number(item.orderedOn))
          }
        });
      } else if (item.orderedOn && _.isNumber(item.orderedOn)) {
        StockOrders.update({_id: item._id}, {
          $set: {
            orderedOn: new Date(item.orderedOn)
          }
        });
      }

      if (item.expectedDeliveryDate && _.isString(item.expectedDeliveryDate)) {
        StockOrders.update({_id: item._id}, {
          $set: {
            expectedDeliveryDate: new Date(Number(item.expectedDeliveryDate))
          }
        });
      } else if (item.expectedDeliveryDate && _.isNumber(item.expectedDeliveryDate)) {
        StockOrders.update({_id: item._id}, {
          $set: {
            expectedDeliveryDate: new Date(item.expectedDeliveryDate)
          }
        });
      }
    });
  }
});