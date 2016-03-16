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
    throw new Meteor.Error(500, "Order item doesn't exists");
  }

  return true;
});

let OrderItemDocument = Match.Where(function (orderItemDoc) {
  check(orderItemDoc, {
    _id: Match.Optional(StocktakeId),
    countNeeded: Number,
    countOnHand: Number,
    countOrdered: Number,
    orderId: OrderId,
    unit: String,
    unitPrice: Number,
    deliveryStatus: [String],
    originalPrice: Number,
    relations: HospoHero.checkers.Relations
  });
  return true;
});


Namespace('HospoHero.checkers', {
  OrderId: OrderId,
  OrderDocument: OrderDocument,
  OrderItemId: OrderItemId,
  OrderItemDocument: OrderItemDocument
});
