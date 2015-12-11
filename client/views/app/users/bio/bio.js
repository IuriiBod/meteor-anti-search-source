Template.userBio.helpers({
  userId: function () {
    if (this.userId) {
      return this.userId;
    }
  }
});
Template.userBio.events({
  "click *": function (event, tmpl) {
    if (_.isFunction(tmpl.data.onClick)) {
      var userId = tmpl.data.userId;
      var switchUser = tmpl.data.onClick;
      switchUser(userId);
    }
  }
});