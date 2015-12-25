Migrations.add({
  version: 41,
  name: "Remove staus and tag fields from menu items",
  up: function () {
    MenuItems.update({staus: {$ne: null}}, {$unset: {staus: 1}}, {multi: true});
    MenuItems.update({tag: {$ne: null}}, {$unset: {tag: 1}}, {multi: true});
    MenuItems.find().forEach(function (menuItem) {
      MenuItems.update({_id: menuItem._id}, {$set: {salesPrice: parseFloat(menuItem.salesPrice)}});
    });
  }
});
