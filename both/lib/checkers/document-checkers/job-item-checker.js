let JobItemStatus = Match.OneOf('active', 'archived');

var JobItemDocument = Match.Where(function (jobItem) {
  check(jobItem.type, HospoHero.checkers.MongoId);
  var jobItemType = JobTypes.findOne({_id: jobItem.type}).name;

  if (jobItemType === 'Recurring') {
    check(jobItem, {
      name: String,
      type: HospoHero.checkers.MongoId,
      activeTime: Number,
      wagePerHour: Number,

      _id: HospoHero.checkers.OptionalMongoId,
      relations: Match.Optional(HospoHero.checkers.Relations),
      createdBy: HospoHero.checkers.OptionalNullableMongoId,
      createdOn: Match.Optional(Date),
      editedBy: HospoHero.checkers.OptionalNullableMongoId,
      editedOn: Match.Optional(Date),
      status: Match.Optional(String),

      section: HospoHero.checkers.MongoId,
      description: String,
      frequency: Match.OneOf('daily', 'weekly', 'everyXWeeks'),
      repeatAt: Date,
      startsOn: Date,
      endsOn: {
        on: Match.Optional('endsNever'),
        lastDate: Match.Optional(Date),
        after: Match.Optional(Number)
      },

      checklist: Match.Optional([String]),
      repeatOn: Match.Optional([String]),
      repeatEvery: Match.Optional(Number)
    });
  } else if (jobItemType === 'Prep') {
    check(jobItem, {
      name: String,
      type: HospoHero.checkers.MongoId,
      activeTime: Number,
      wagePerHour: Number,

      _id: HospoHero.checkers.OptionalMongoId,
      relations: Match.Optional(HospoHero.checkers.Relations),
      createdBy: HospoHero.checkers.OptionalNullableMongoId,
      createdOn: Match.Optional(Date),
      editedBy: HospoHero.checkers.OptionalNullableMongoId,
      editedOn: Match.Optional(Date),
      status: Match.Optional(HospoHero.checkers.JobItemStatus),

      recipe: String,
      ingredients: [{
        _id: HospoHero.checkers.MongoId,
        quantity: Number
      }],
      portions: Number,
      shelfLife: Number
    });
  }

  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(jobItem, JobItems);
  checkerHelper.checkPropertiesGroup(['startsOn', 'endsOn'], function () {
    if (jobItemType === 'Recurring') {
      if (jobItem.endsOn.lastDate && jobItem.endsOn.lastDate < jobItem.startsOn) {
        throw new Meteor.Error("'Starts on' should be less then 'ends on'");
      }
    }
  });

  return true;
});

Namespace('HospoHero.checkers', {
  JobItemDocument: JobItemDocument,
  JobItemStatus: JobItemStatus
});