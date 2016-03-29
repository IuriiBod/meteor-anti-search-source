let ApplicationSchemaDocument = {
  name: true,  // field is required
  email: true, // field is required
  availability: Match.Optional(Boolean),
  dateOfBirth: Match.Optional(Boolean),
  files: Match.Optional(Boolean),
  message: Match.Optional(Boolean),
  numberOfHours: Match.Optional(Boolean),
  phone: Match.Optional(Boolean)
}

Namespace('HospoHero.checkers', {
  ApplicationSchemaDocument: ApplicationSchemaDocument
});