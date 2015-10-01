Namespace('HospoHero', {
  currentArea: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    return user.defaultArea ? user.defaultArea : null;
  }
});