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

Meteor.publish('managerNote', function (date, areaId) {
  check(date, Date);
  check(areaId, HospoHero.checkers.MongoId);

  return ManagerNotes.find({
    noteDate: date,
    'relations.areaId': areaId
  });
});