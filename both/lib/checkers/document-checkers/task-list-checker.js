var TaskListChecker = Match.Where(function (task) {
  check(task, {
    title: String,
    dueDate: Date,
    assignedTo: [HospoHero.checkers.MongoId],
    sharing: {
      type: String,
      id: HospoHero.checkers.MongoId
    },
    duration: Match.Optional(Number),
    done: Boolean,

    // Optional
    _id: HospoHero.checkers.OptionalMongoId,
    description: Match.Optional(String),
    reference: Match.OneOf({}, {
      id: HospoHero.checkers.MongoId,
      type: String
    }),
    completedBy: Match.Optional(HospoHero.checkers.NullableMongoId)
  });

  return true;
});

Namespace('HospoHero.checkers', {
  TaskListChecker: TaskListChecker
});