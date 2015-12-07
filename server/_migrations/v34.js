Migrations.add({
  version: 34,
  name: "Add default details to old suppliers",
  up: function () {
    Suppliers.update({}, {
      $set: {
        minimumOrderAmount: 1,
        deliveryDay: 'sunday',
        deliveryTime: new Date(),
        contactName: 'Unnamed',
        customerNumber: '007'
      }
    }, {multi: true});
  }
});
