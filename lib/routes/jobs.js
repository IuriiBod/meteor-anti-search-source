Router.route('/jobs', {
  name: "jobs",
  path: '/jobs',
  template: "jobsMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("unAssignedJobs"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});