Meteor.methods({
  upsertManagerNote: function(noteObject) {
    console.log('NOTE', noteObject);

    check(noteObject, HospoHero.checkers.ManagerNotesDocument);

    if (!HospoHero.canUser('edit roster')) {
      logger.error('User not permitted to add manager notes!', {userId: Meteor.userId()});
      throw new Meteor.Error('User not permitted to add manager notes!', {userId: Meteor.userId()});
    } else {
      if(noteObject._id) {
        return ManagerNotes.update({_id: noteObject._id}, {$set: noteObject});
      } else {
        return ManagerNotes.insert(noteObject);
      }
    }
  }
});