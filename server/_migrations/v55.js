Migrations.add({
  version: 55,
  name: 'Remove duplicated stock orders',
  up: function () {
    StockOrders.find().forEach(function (order) {
      var id = order._id;
      delete order._id;
      var sameOrders = StockOrders.find(order);

      if (sameOrders.count() > 1) {
        StockOrders.remove({_id: id});
      }
    });
  }
});