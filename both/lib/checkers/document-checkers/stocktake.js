let StocktakeId = Match.Where(function (stocktakeId) {
  check(stocktakeId, HospoHero.checkers.MongoId);

  if (!Stocktakes.findOne({_id: stocktakeId})) {
    throw new Meteor.Error(500, "Stocktake doesn't exists");
  }

  return true;
});

let StocktakeDocument = Match.Where(function (stocktakeDoc) {
  check(stocktakeDoc, {
    _id: Match.Optional(StocktakeId),
    date: Date,
    relations: HospoHero.checkers.Relations
  });
  return true;
});


let StockItemId = Match.Where(function (stockItemId) {
  check(stockItemId, HospoHero.checkers.MongoId);

  if (!StockItems.findOne({_id: stockItemId})) {
    throw new Meteor.Error(500, "Stock item doesn't exists");
  }

  return true;
});

let StockItemDocument = Match.Where(function (stockItemDoc) {
  check(stockItemDoc, {
    _id: Match.Optional(StockItemId),
    stocktakeId: HospoHero.checkers.MongoId,
    specialAreaId: HospoHero.checkers.MongoId,
    count: Match.Optional(HospoHero.checkers.PositiveNumber),
    ingredient: {
      id: HospoHero.checkers.MongoId,
      cost: HospoHero.checkers.PositiveNumber
    },
    relations: HospoHero.checkers.Relations
  });

  return true;
});


Namespace('HospoHero.checkers', {
  StocktakeId: StocktakeId,
  StockItemId: StockItemId,
  StocktakeDocument: StocktakeDocument,
  StockItemDocument: StockItemDocument
});