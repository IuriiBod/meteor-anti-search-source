let OrderId = Match.Where(function (orderId) {
  check(orderId, HospoHero.checkers.MongoId);

  if (!Orders.findOne({_id: orderId})) {
    throw new Meteor.Error(500, "Order doesn't exists");
  }

  return true;
});

let OrderDocument = Match.Where(function (orderDoc) {
  check(orderDoc, {
    _id: Match.Optional(OrderId),
    createdAt: Date,
    placedBy: HospoHero.checkers.MongoId,
    orderedThrough: Match.Optional({
      email: Match.Optional(HospoHero.checkers.Email),
      date: Date,
      type: Match.OneOf('phoned', 'emailed')
    }),
    orderNote: Match.Optional(String),
    supplierId: HospoHero.checkers.MongoId,
    stocktakeId: HospoHero.checkers.MongoId,
    expectedDeliveryDate: Match.Optional(Date),
    receivedBy: HospoHero.checkers.OptionalMongoId,
    receivedDate: Match.Optional(Date),
    receiveNote: Match.Optional(String),
    temperature: Match.Optional(Number),
    invoiceImage: Match.Optional({
      originalUrl: String,
      convertedUrl: String,
      type: Match.OneOf('pdf', 'csv', 'doc', 'doc', 'image')
    }),
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


let OrderItemDocument = Match.Where(function (orderItem) {
  check(orderItem, {
    _id: Match.Optional(OrderItemId),
    orderId: HospoHero.checkers.OrderId,
    orderedCount: HospoHero.checkers.PositiveNumber,
    receivedCount: Match.Optional(HospoHero.checkers.PositiveNumber),
    ingredient: {
      id: HospoHero.checkers.MongoId,
      cost: HospoHero.checkers.PositiveNumber,
      originalCost: Match.Optional(HospoHero.checkers.PositiveNumber)
    },
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
