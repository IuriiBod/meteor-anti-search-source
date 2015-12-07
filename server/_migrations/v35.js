Migrations.add({
  version: 35,
  name: "Change suppliers createdOn dates from timestamp to Date object",
  up: function () {
    Suppliers.find().forEach(function (supplier) {
      var phone = _.isString(supplier.phone) ? supplier.phone.replace(/\s*/g, '') : supplier.phone;
      Suppliers.update({_id: supplier._id}, {
        $set: {
          createdOn: new Date(supplier.createdOn),
          phone: phone
        }
      });
    });
  }
});
