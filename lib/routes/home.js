//--------------------HOME
Router.route("/", {
  name: "home",
  template: "home",
  path: "/",
  waitOn: function() {
    if(Meteor.userId()) {
      return [
        this.subscribe('organizationInfo'),
        this.subscribe('shifts', 'future', Meteor.userId()),
        this.subscribe('shifts', 'past', Meteor.userId()),
        this.subscribe('shifts', 'opened'),
        this.subscribe('allSections'),
        this.subscribe('comments', Meteor.userId()),
        this.subscribe('newsfeeds')
      ];
    }
  },
  data: function() {
    Session.set('editStockTake', false);
  }
});