Namespace('HospoHero', {
  currentArea: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    return user && user.defaultArea ? user.defaultArea : null;
  }
});