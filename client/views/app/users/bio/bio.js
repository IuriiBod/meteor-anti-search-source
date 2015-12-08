Template.userBio.onCreated(function() {
  this.set('user', this.data.user);
  this.set('onClick', this.data.onClick);
});

Template.userBio.helpers({
  userId: function () {
    var user = Template.instance().get('user');
    if (user) {
      return user._id;
    }
  }
});
Template.userBio.events({
  "click *": function (event, tmpl) {
    if (_.isFunction(tmpl.get('onClick'))) {
      var user = tmpl.get("user");
      var switchUser = tmpl.get('onClick');
      switchUser(user._id);
    }
  }
});