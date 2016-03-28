Migrations.add({
  version: 68,
  name: 'Copying all stock items from Cafe Kitchen to Catering Kitchen',
  up: function () {
    //let cafeKitchenId = 'Jeoa5mjds2ybBnne8';
    //let cateringKitchenId = 'BE3mRTYNLjDncJ5P5';
    //
    //let cateringKitchenRelationsObject = HospoHero.getRelationsObject(cateringKitchenId);
    //
    //Ingredients.find({'relations.areaId': cafeKitchenId}).forEach((ingredient) => {
    //  let supplier = Suppliers.findOne({_id: ingredient.suppliers});
    //  if (supplier && supplier.name) {
    //    let existingSupplier = Suppliers.findOne({'relations.areaId': cateringKitchenId, name: supplier.name});
    //
    //    if (existingSupplier) {
    //      ingredient.suppliers = existingSupplier._id;
    //    } else {
    //      delete supplier._id;
    //      supplier.relations = cateringKitchenRelationsObject;
    //      ingredient.suppliers = Suppliers.insert(supplier);
    //    }
    //
    //    delete ingredient._id;
    //    ingredient.relations = cateringKitchenRelationsObject;
    //    Ingredients.insert(ingredient);
    //  }
    //});
  }
});