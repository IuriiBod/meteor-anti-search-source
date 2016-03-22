Migrations.add({
  version: 69,
  name: 'Remove old stocktake collections (they are incompatible anymore)',
  up: function () {
    let GeneralAreas = new Mongo.Collection("generalAreas");
    let SpecialAreas = new Mongo.Collection("specialAreas");
    //migrate special/general areas
    GeneralAreas.find({active: true}).forEach(garea => {
      let gareaId = StockAreas.insert({
        name: garea.name,
        createdAt: garea.createdAt,
        relations: garea.relations
      });

      SpecialAreas.find({_id: {$in: garea.specialAreas}, active: true}).forEach(sarea => {
        StockAreas.insert({
          name: sarea.name,
          generalAreaId: gareaId,
          ingredientsIds: sarea.stocks,
          createdAt: sarea.createdAt,
          relations: sarea.relations
        });
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