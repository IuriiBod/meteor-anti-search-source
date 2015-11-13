var ManagerNotesDocument = Match.Where(function (note) {
  check(note, {
    _id: HospoHero.checkers.OptionalMongoId,
    text: String,
    noteDate: Date,
    createdAt: Date,
    createdBy: HospoHero.checkers.MongoId,
    relations: HospoHero.checkers.Relations
  });
  return true;
});

Namespace('HospoHero.checkers', {
  ManagerNotesDocument: ManagerNotesDocument
});