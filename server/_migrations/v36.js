Migrations.add({
  version: 36,
  name: "Move delivery days into array",
  up: function () {
    Suppliers.find().forEach(function (supplier) {
      Suppliers.update({_id: supplier._id}, {
        $set: {
          deliveryDays: [supplier.deliveryDay]
        },
        $unset: {
          deliveryDay: 1
        }
      });
    });
  }
});
