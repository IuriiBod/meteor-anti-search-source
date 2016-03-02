var RelatedItemDocument = Match.Where(function (relatedItem) {
  check(relatedItem, {
    name: String,
    url: String,
    referenceId: HospoHero.checkers.MongoId,
    type: String,

    _id: HospoHero.checkers.OptionalMongoId,
    createdBy: HospoHero.checkers.OptionalMongoId,
    createdAt: Match.Optional(Date)
  });

  return true;
});

Namespace('HospoHero.checkers', {
  RelatedItemDocument: RelatedItemDocument
});