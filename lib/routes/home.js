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
        Meteor.subscribe("rosteredFutureShifts", Meteor.userId()),
        Meteor.subscribe("rosteredPastShifts", Meteor.userId()),
        Meteor.subscribe("openedShifts"),
        Meteor.subscribe("allSections"),
        Meteor.subscribe("comments", Meteor.userId()),
        Meteor.subscribe("newsfeeds")
      ];
    }
  },
  data: function() {
    Session.set("editStockTake", false);
  }
});