var FileDocument = Match.Where(function (file) {
  check(file, {
    name: String,
    url: String,
    referenceId: HospoHero.checkers.MongoId,

    _id: HospoHero.checkers.OptionalMongoId,
    createdBy: HospoHero.checkers.OptionalMongoId,
    createdAt: Match.Optional(Date)
  });
  return true;
});

Namespace('HospoHero.checkers', {
  FileDocument: FileDocument
});