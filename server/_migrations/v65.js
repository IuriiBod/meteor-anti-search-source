Migrations.add({
  version: 65,
  name: 'Remove old stocktake collections (they are incompatible anymore)',
  up: function () {
    //migrate special/general areas
    GeneralAreas.find().forEach(garea => {
      let gareaId = StockAreas.insert({
        name: garea.name,
        active: garea.active,
        relations: garea.relations
      });

      garea.specialAreas.forEach(sareaId=> {
        let sarea = SpecialAreas.findOne({_id: sareaId});
        StockAreas.insert({
          name: sarea.name,
          generalAreaId: gareaId,
          ingredientsIds: sarea.stocks,
          active: sarea.active,
          relations: sarea.relations
        })
      });
    });

    //remove everything from old stocktake
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
