Migrations.add({
  version: 65,
  name: 'Remove old stocktake collections (they are incompatible anymore)',
  up: function () {
    let GeneralAreas = new Mongo.Collection("generalAreas");
    let SpecialAreas = new Mongo.Collection("specialAreas");
    //migrate special/general areas
    GeneralAreas.find().forEach(garea => {
      let gareaId = StockAreas.insert({
        name: garea.name,
        active: garea.active,
        createdAt: garea.createdAt,
        relations: garea.relations
      });

      garea.specialAreas.forEach(sareaId => {
        let sarea = SpecialAreas.findOne({_id: sareaId});
        StockAreas.insert({
          name: sarea.name,
          generalAreaId: gareaId,
          ingredientsIds: sarea.stocks,
          active: sarea.active,
          createdAt: sarea.createdAt,
          relations: sarea.relations
        })
      });
    });

    //remove redundant links
    Ingredients.update({}, {
      $unset: {
        specialAreas: '',
        generalAreas: ''
      }
    });

    //remove everything from old stocktake
    let collectionsToRemove = [
      "generalAreas",
      "specialAreas",
      "stocktakeMain",
      "stockOrders",
      "orderReceipts",
      "stocktakes"
    ];

    collectionsToRemove.forEach(
        name => Migrations.utils.removeCollection(name)
    );
  }
});
