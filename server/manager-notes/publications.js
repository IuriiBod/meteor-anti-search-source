Meteor.publish('managerNotes', function (weekRange, areaId) {
  check(areaId, HospoHero.checkers.MongoId);
  check(weekRange, HospoHero.checkers.WeekRange);

  if (this.userId) {
    this.ready();
    return;
  }
  //todo: any security checks here?

  return ManagerNotes.find({
    noteDate: weekRange,
    'relations.areaId': areaId
  });
});