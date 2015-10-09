//--------------------HOME
Router.route("/", {
  name: "home",
  template: "home",
  path: "/",
  waitOn: function() {
    if(Meteor.userId()) {
      return [
        Meteor.subscribe('currentOrganization'),
        Meteor.subscribe('locationsOfOrganization'),
        Meteor.subscribe('areasOfOrganization'),
        subs.subscribe("rosteredFutureShifts", Meteor.userId()),
        subs.subscribe("rosteredPastShifts", Meteor.userId()),
        subs.subscribe("openedShifts"),
        subs.subscribe("allSections"),
        subs.subscribe("comments", Meteor.userId()),
        subs.subscribe("newsfeeds")
      ];
    }
  },
  data: function() {
    Session.set("editStockTake", false);
  }
});