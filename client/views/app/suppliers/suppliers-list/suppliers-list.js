Template.suppliersList.helpers({
  list: function () {
    return Suppliers.find({}, {sort: {"name": 1}});
  }
});