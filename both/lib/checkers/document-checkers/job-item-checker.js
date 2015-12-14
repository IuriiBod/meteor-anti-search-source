var JobItemDocument = Match.Where(function (jobItem) {
  check(jobItem, {
    name: String,
    type: HospoHero.checkers.MongoId,
    activeTime: Number,
    wagePerHour: Number,

    ////optional properties
    _id: HospoHero.checkers.OptionalMongoId,
    createdBy: HospoHero.checkers.OptionalNullableMongoId,
    createdOn: Match.Optional(Date),
    editedOn: Match.Optional(Date),
    status: Match.Optional(String), // ?
    relations: Match.Optional(HospoHero.checkers.Relations),

    // properties for recurring
    section: HospoHero.checkers.OptionalMongoId,
    description: Match.Optional(String),
    checklist: Match.Optional(Array),
    frequency: Match.Optional(Match.OneOf('daily', 'weekly', 'everyXWeeks')),
    repeatAt: Match.Optional(Date),
    repeatOn: Match.Optional(Array),
    repeatEvery: Match.Optional(Number),
    startsOn: Match.Optional(Date),
    endsOn: Object,

    // properties for prep
    recipe: Match.Optional(String),
    ingredients: Match.Optional(Array),
    portions: Match.Optional(Number),
    shelfLife: Match.Optional(Number)
  });

  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(jobItem, JobItems);

  return true;
});

Namespace('HospoHero.checkers', {
  /**
   * Shift document checker
   */
  JobItemDocument: JobItemDocument
});