Migrations.add({
  version: 33,
  name: "Move priceList to array",
  up: function () {
    Suppliers.find({priceList: {$ne: null}}).forEach(function (supplier) {
      Suppliers.update({
        _id: supplier._id
      }, {
        priceList: [
          {
            url: supplier.priceList,
            name: 'Unnamed price list',
            uploadedAt: new Date()
          }
        ]
      });
    });
  }
});
