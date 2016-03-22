let ApplicationSchemaDocument = Match.Where(schema => {
  _.each(schema, (value) => {
    check(value, Match.Optional(Boolean));
  });

  return true;
});

Namespace('HospoHero.checkers', {
  ApplicationSchemaDocument: ApplicationSchemaDocument
});