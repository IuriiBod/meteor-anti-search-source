Migrations.add({
  version: 65,
  name: 'Remove old stocktake collections (they are incompatible anymore)',
  up: function () {
    let collectionsToRemove = [
      "generalAreas",
      "specialAreas",
      "stocktakeMain",
      "stockOrders",
      "orderReceipts"
    ];

    collectionsToRemove.forEach(
        name => Migrations.utils.removeCollection(name)
    );
  }
});
