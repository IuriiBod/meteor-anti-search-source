Router.route('/jobs', {
  name: "jobs",
  path: '/jobs',
  template: "jobsMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('jobs', 'unassigned'),
      Meteor.subscribe("jobTypes")
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});