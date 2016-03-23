Migrations.add({
  version: 69,
  name: 'Revert changes made by migration v68',
  up: function () {
    //let cafeKitchenId = 'Jeoa5mjds2ybBnne8';
    //let cateringKitchenId = 'BE3mRTYNLjDncJ5P5';
    //
    //let cateringKitchenRelationsObject = HospoHero.getRelationsObject(cateringKitchenId);
    //
    //Ingredients.find({'relations.areaId': cafeKitchenId}).forEach(ingredient => {
    //
    //  Ingredients.remove({
    //    code: ingredient.code,
    //    'relations.areaId': cateringKitchenId
    //  });
    //
    //  let supplier = Suppliers.findOne({_id: ingredient.suppliers});
    //  if (supplier && supplier.name) {
    //    let existingSuppliers = Suppliers.find({
    //      'relations.areaId': cateringKitchenId,
    //      $or: [
    //        {name: supplier.name},
    //        {phone: supplier.phone},
    //        {email: supplier.email}
    //      ]
    //    }).fetch();
    //
    //    if (existingSuppliers.length) {
    //      ingredient.suppliers = existingSuppliers[0]._id;
    //
    //      for (let i=1; i< existingSuppliers.length; i++) {
    //        Suppliers.remove({
    //          _id: existingSuppliers[i]._id
    //        });
    //      }
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