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


let OrderItemId = Match.Where(function (orderItemId) {
  check(orderItemId, HospoHero.checkers.MongoId);

  if (!OrderItems.findOne({_id: orderItemId})) {
    throw new Meteor.Error(500, "Order doesn't exists");
  }

  return true;
});


let OrderItemDocument = Match.Where(function (orderItem) {
  check(orderItem, {
    _id: Match.Optional(OrderItemId),
    orderedCount: Number,
    receivedCount: Number,
    orderId: HospoHero.checkers.OrderId,
    deliveryStatus: Match.Optional([String]), //todo:stocktake clarify it
    ingredient: {
      id: HospoHero.checkers.MongoId,
      cost: Number,
      originalCost: Match.Optional(Number)
    },
    relations: HospoHero.checkers.Relations
  });
});


Namespace('HospoHero.checkers', {
  OrderId: OrderId,
  OrderDocument: OrderDocument,
  OrderItemId: OrderItemId,
  OrderItemDocument: OrderItemDocument
});
