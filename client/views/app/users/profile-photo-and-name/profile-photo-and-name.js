Template.profilePhotoAndName.helpers({
  userId: function () {
    if (this.userId) {
      return this.userId;
    }
  }
});
Template.profilePhotoAndName.events({
  "click *": function (event, tmpl) {
    if (_.isFunction(tmpl.data.onClick)) {
      var userId = tmpl.data.userId;
      var switchUser = tmpl.data.onClick;
      switchUser(userId);
    }
  }
});