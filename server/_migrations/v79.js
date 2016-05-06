Migrations.add({
  version: 79,
  name: "Fix emails in orders",
  up: function () {
    Orders.find({'orderedThrough.email': {$gt: []}}).forEach((order) => {
      const email = order.orderedThrough.email[0];

      Orders.update({_id: order._id}, {
        $set: {'orderedThrough.email': email}
      });
    })
  }
});