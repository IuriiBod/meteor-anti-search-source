//--------------------HOME
Router.route("/", {
  name: "home",
  template: "home",
  path: "/",
  waitOn: function() {
    return [
      subs.subscribe("rosteredFutureShifts", Meteor.userId()),
      subs.subscribe("rosteredPastShifts", Meteor.userId()),
      subs.subscribe("openedShifts"),
      subs.subscribe("allSections"),
      subs.subscribe("comments", Meteor.userId()),
      subs.subscribe("posts")
    ];
  },
  data: function() {
    Session.set("editStockTake", false);
  },
  fastRender: true
});