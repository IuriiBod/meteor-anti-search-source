var CommentChecker = Match.Where(function (comment) {
  check(comment, {
    text: String,
    reference: HospoHero.checkers.MongoId,

    // Optional
    _id: HospoHero.checkers.OptionalMongoId,
    createdOn: Match.Optional(Date),
    createdBy: Match.Optional(HospoHero.checkers.MongoId),
    relations: Match.Optional(HospoHero.checkers.Relations),
  });

  return true;
});

Namespace('HospoHero.checkers', {
  CommentChecker: CommentChecker
});