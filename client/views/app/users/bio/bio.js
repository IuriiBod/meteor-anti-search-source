Template.userBio.helpers({
  userId: function () {
    var user = Template.instance().data.user;
    if (user) {
      return user._id;
    }
  }
});
Template.userBio.events({
  "click *": function (event, tmpl) {
    if (_.isFunction(tmpl.data.onClick)) {
      var user = tmpl.data.user;
      var switchUser = tmpl.data.onClick;
      switchUser(user._id);
    }
  }
});