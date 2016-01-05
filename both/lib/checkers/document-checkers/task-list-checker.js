var TaskListChecker = Match.Where(function (task) {
  check(task, {
    title: String,
    dueDate: Date,
    sharingType: String,
    sharingIds: Match.OneOf(HospoHero.checkers.MongoId, [HospoHero.checkers.MongoId]),
    done: Boolean,

    // Optional
    description: Match.Optional(String),
    reference: Match.OneOf({}, {
      id: HospoHero.checkers.MongoId,
      type: String
    })
  });

  return true;
});

Namespace('HospoHero.checkers', {
  TaskListChecker: TaskListChecker
});