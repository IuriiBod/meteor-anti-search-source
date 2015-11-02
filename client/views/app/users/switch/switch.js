Template.switchUserView.helpers({
  users: function () {
    var usersIds = Session.get("loggedUsers") || {};
    usersIds = _.keys(usersIds);
    var users = Meteor.users.find({
      _id: {
        $in: usersIds
      }
    });
    return users.fetch();
  }
});