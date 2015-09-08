Router.route('/jobs', {
  name: "jobs",
  path: '/jobs',
  template: "jobsMainView",
  waitOn: function() {
    return [
      Meteor.subscribe("unAssignedJobs"),
      subs.subscribe("jobTypes")
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});