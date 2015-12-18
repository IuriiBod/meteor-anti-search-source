Migrations.add({
  version: 35,
  name: "Change suppliers createdOn dates from timestamp to Date object",
  up: function () {
    Suppliers.find().forEach(function (supplier) {
      var phone = _.isString(supplier.phone) ? supplier.phone.replace(/\s*/g, '') : supplier.phone;
      var createdOn = /\d{13}/.test(supplier.createdOn) ? new Date(supplier.createdOn) : supplier.createdOn;

      Suppliers.update({_id: supplier._id}, {
        $set: {
          createdOn: createdOn,
          phone: phone
        }
      });
    });
  }
});