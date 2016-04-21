var ManagerNotesDocument = Match.Where(function (note) {
  check(note, {
    _id: HospoHero.checkers.OptionalMongoId,
    text: Match.Optional(String),
    noteDate: Date,
    updatedAt: Match.Optional(Date),
    updatedBy: HospoHero.checkers.OptionalMongoId,
    relations: HospoHero.checkers.Relations
  });
  return true;
});

Namespace('HospoHero.checkers', {
  ManagerNotesDocument: ManagerNotesDocument
});