//--------------------HOME
Router.route("/", {
  name: "home",
  template: "home",
  path: "/",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("rosteredFutureShifts", Meteor.userId()));
    cursors.push(subs.subscribe("rosteredPastShifts", Meteor.userId()));
    cursors.push(subs.subscribe("openedShifts"));
    cursors.push(subs.subscribe("allSections"));
    cursors.push(subs.subscribe("comments", Meteor.userId()));
    cursors.push(subs.subscribe("posts"));
    cursors.push(subs.subscribe("usersList"));

    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("signIn");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});