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
      if (noteObject._id) {
        return ManagerNotes.update({_id: noteObject._id}, {$set: noteObject});
      } else {
        return ManagerNotes.insert(noteObject);
      }
    }
  },

  deleteManagerNote: function (noteId) {
    check(noteId, HospoHero.checkers.MongoId);

    if (!canUserEditRoster()) {
      logger.error('User not permitted to delete manager notes!', {userId: Meteor.userId()});
      throw new Meteor.Error('User not permitted to delete manager notes!', {userId: Meteor.userId()});
    } else {
      return ManagerNotes.remove({_id: noteId});
    }
  }
});