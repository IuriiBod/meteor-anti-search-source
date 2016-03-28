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
    description: String,
    costPerPortion: Number,
    portionOrdered: Match.Optional(String),
    unitSize: Number,
    portionUsed: Match.Optional(String),
    status: Match.OneOf('active', 'archived'),
    suppliers: HospoHero.checkers.OptionalMongoId,
    createdBy: HospoHero.checkers.OptionalMongoId,
    createdOn: Number,
    editedBy: HospoHero.checkers.OptionalMongoId,
    editedOn: Match.Optional(Number),
    relations: HospoHero.checkers.Relations
  });
  return true;
});


Namespace('HospoHero.checkers', {
  IngredientId: IngredientId,
  IngredientDocument: IngredientDocument
});
