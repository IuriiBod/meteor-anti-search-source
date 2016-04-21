var canUserEditRoster = function () {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(null, 'edit roster');
};

Meteor.methods({
  upsertManagerNote: function (noteObject) {
    check(noteObject, HospoHero.checkers.ManagerNotesDocument);

    if (!canUserEditRoster()) {
      logger.error('User not permitted to add manager notes!', {userId: Meteor.userId()});
      throw new Meteor.Error('User not permitted to add manager notes!', {userId: Meteor.userId()});
    } else {
      const noteId = noteObject._id;
      delete noteObject._id;

      ManagerNotes.update({
        _id: noteId
      }, {
        $set: noteObject
      }, {
        upsert: true
      });
    }
  }
});