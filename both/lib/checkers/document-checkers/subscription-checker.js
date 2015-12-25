var SubscriptionDocument = Match.Where(function (subscription) {
  check(subscription, {
    type: Match.OneOf('menu', 'job'),
    itemIds: Match.OneOf(HospoHero.checkers.MongoId, [HospoHero.checkers.MongoId], 'all'),
    subscriber: HospoHero.checkers.MongoId,
    relations: HospoHero.checkers.Relations,

    _id: HospoHero.checkers.OptionalMongoId
  });

  return true;
});

Namespace('HospoHero.checkers', {
  SubscriptionDocument: SubscriptionDocument
});