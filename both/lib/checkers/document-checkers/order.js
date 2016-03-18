let OrderId = Match.Where(function (orderId) {
  check(orderId, HospoHero.checkers.MongoId);

  if (!Orders.findOne({_id: orderId})) {
    throw new Meteor.Error(500, "Order doesn't exists");
  }

  return true;
});

let OrderDocument = Match.Where(function (orderDoc) {
  check(orderDoc, {
    _id: Match.Optional(StocktakeId),
    createdAt: Date,
    placedBy: Match.checkers.MongoId,
    orderedThrough: Match.Optional({
      details: String,
      through: String
    }),
    supplierId: HospoHero.checkers.MongoId,
    stocktakeId: HospoHero.checkers.MongoId,
    expectedDeliveryDate: Match.Optional(Date),
    receivedBy: HospoHero.checkers.OptionalMongoId,
    receivedDate: Match.Optional(Date),
    relations: HospoHero.checkers.Relations
  });
  return true;
});


Namespace('HospoHero.checkers', {
  OrderId: OrderId,
  OrderDocument: OrderDocument
});
