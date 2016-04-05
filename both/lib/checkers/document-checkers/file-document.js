var FileDocument = Match.Where(file => {
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

var FilePickerFile = Match.Where(file => {
  check(file, {
    _id: HospoHero.checkers.NullableMongoId,
    url: String,
    filename: String,
    mimetype: String,
    size: Number,
    isWriteable: Boolean
  });
  return true;
});

Namespace('HospoHero.checkers', {
  FileDocument: FileDocument,
  FilePickerFile: FilePickerFile
});