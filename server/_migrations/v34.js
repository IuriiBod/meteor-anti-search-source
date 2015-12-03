Migrations.add({
  version: 34,
  name: "Move priceList to array",
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
