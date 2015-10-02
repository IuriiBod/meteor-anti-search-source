Namespace('HospoHero', {
  currentArea: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    return user && user.currentAreaId ? user.currentAreaId : null;
  }
});