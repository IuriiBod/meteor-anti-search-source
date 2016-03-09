Meteor.publish('managerNotes', function (weekRange, areaId) {
  check(areaId, HospoHero.checkers.MongoId);
  check(weekRange, HospoHero.checkers.WeekRange);

  //todo: any security checks here?

  let weekNotes = () => {
    return ManagerNotes.find({
      noteDate: weekRange,
      'relations.areaId': areaId
    });
  };

  let notes = weekNotes();

  if (notes.fetch().length >= 7) {
    return notes;
  }

  let daysOfWeek = HospoHero.dateUtils.getWeekDays(weekRange.$gte);

  daysOfWeek.forEach((date) => {
    let note = ManagerNotes.find({
      noteDate: date,
      'relations.areaId': areaId
    });

    if (!note.fetch().length) {
      ManagerNotes.insert({
        noteDate: date,
        relations: HospoHero.getRelationsObject(areaId)
      });
    }
  });

  return weekNotes();
});