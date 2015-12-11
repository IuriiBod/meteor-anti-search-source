Template.dashboard.helpers({
  'name': function () {
    var user = Meteor.user();
    if (user) {
      var name = user.username + " ";
      name = name.slice(0, name.indexOf(" "));
      return name;
    }
  }
});