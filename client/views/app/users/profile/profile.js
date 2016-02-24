Template.profileMainView.helpers({
  user: function () {
    var userId = Router.current().params._id;
    return Meteor.users.findOne({_id: userId});
  },

  name: function () {
    var id = Router.current().params._id;
    var user = Meteor.users.findOne(id);
    var loggedIn = Meteor.user();
    if (user) {
      if (user._id == loggedIn._id) {
        return "My Profile";
      } else {
        return user.profile.firstname + "'s Profile";
      }
    }
  },

  me: function () {
    var id = HospoHero.getParamsFromRoute('_id');
    return Meteor.userId() && Meteor.userId() === id;
  }
});