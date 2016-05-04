let IngredientId = Match.Where(function (ingredientId) {
  check(ingredientId, HospoHero.checkers.MongoId);

  if (!Ingredients.findOne({_id: ingredientId})) {
    throw new Meteor.Error(500, "Ingredient doesn't exists");
  }

  return true;
});

let IngredientDocument = Match.Where(function (stockItemDoc) {
  check(stockItemDoc, {
    _id: Match.Optional(IngredientId),
    code: String,
    shelfLife: Number,
    description: String,
    suppliers: Match.OneOf('', HospoHero.checkers.MongoId),

    costPerPortion: Match.Optional(Number),
    portionOrdered: Match.Optional(String),
    unitSize: Match.Optional(Number),
    portionUsed: Match.Optional(String),
    status: Match.OneOf('active', 'archived'),
    createdBy: HospoHero.checkers.OptionalMongoId,
    createdOn: Match.Optional(Number),
    editedBy: HospoHero.checkers.OptionalMongoId,
    editedOn: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations)
  });
  return true;
});


Namespace('HospoHero.checkers', {
  IngredientId: IngredientId,
  IngredientDocument: IngredientDocument
});
