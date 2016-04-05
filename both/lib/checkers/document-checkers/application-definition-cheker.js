let ApplicationDefinitionSchema = {
  name: true,  // field is required
  email: true, // field is required
  availability: Boolean,
  dateOfBirth: Boolean,
  files: Boolean,
  message: Boolean,
  numberOfHours: Boolean,
  phone: Boolean
};

let ApplicationDefinitionDocument = Match.Where(application => {
  check(application, {
    _id: HospoHero.checkers.OptionalMongoId,
    organizationId: HospoHero.checkers.MongoId,
    positions:Match.Optional([HospoHero.checkers.MongoId]),
    schema:ApplicationDefinitionSchema
  });

  return true;
});

Namespace('HospoHero.checkers', {
  ApplicationDefinitionDocument: ApplicationDefinitionDocument,
  ApplicationDefinitionSchema:ApplicationDefinitionSchema
});