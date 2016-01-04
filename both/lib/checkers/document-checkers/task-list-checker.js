var TaskListChecker = Match.Where(function (task) {
  check(task, {
    title: String,
    date: Date,
    sharingType: String,
    sharingIds: Match.OneOf(HospoHero.checkers.MongoId, [HospoHero.checkers.MongoId]),

    // Optional
    description: Match.Optional(String),
    reference: Match.Optional({
      id: HospoHero.checkers.MongoId,
      type: String
    })
  });

  return true;
});

Namespace('HospoHero.checkers', {
  TaskListChecker: TaskListChecker
});