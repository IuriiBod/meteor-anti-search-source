var JobItemDocument = Match.Where(function (jobItem) {
  check(jobItem.type, HospoHero.checkers.MongoId);
  var jobItemType = JobTypes.findOne({_id: jobItem.type}).name;

  if (jobItemType == 'Recurring') {
    check(jobItem, {
      name: String,
      type: HospoHero.checkers.MongoId,
      activeTime: Number,
      wagePerHour: Number,

      section: HospoHero.checkers.OptionalMongoId,
      description: Match.Optional(String),
      checklist: Match.Optional(Array),
      frequency: Match.Optional(Match.OneOf('daily', 'weekly', 'everyXWeeks')),
      repeatAt: Match.Optional(Date),
      repeatOn: Match.Optional(Array),
      repeatEvery: Match.Optional(Number),
      startsOn: Match.Optional(Date),
      endsOn: Match.Optional(Object),
    });
  } else if (jobItemType == 'Prep') {
    check(jobItem, {
      name: String,
      type: HospoHero.checkers.MongoId,
      activeTime: Number,
      wagePerHour: Number,

      recipe: Match.Optional(String),
      ingredients: Match.Optional(Array),
      portions: Match.Optional(Number),
      shelfLife: Match.Optional(Number)
    });
  }

  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(jobItem, JobItems);
  checkerHelper.checkPropertiesGroup(['startsOn', 'endsOn'], function () {
    if (jobItemType == 'Recurring') {
      if (jobItem.endsOn.lastDate
        && jobItem.endsOn.lastDate < jobItem.startsOn) {
        throw new Meteor.Error("'Starts on' should be less then 'ends on'");
      }
    }
  });

  return true;
});

Namespace('HospoHero.checkers', {
  /**
   * Shift document checker
   */
  JobItemDocument: JobItemDocument
});