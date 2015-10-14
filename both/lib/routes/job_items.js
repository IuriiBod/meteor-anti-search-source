// ---------------------JOB ITEMS
Router.route('/jobItems', {
  name: "jobItemsMaster",
  path: '/jobItems',
  template: "jobItemsListMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections'),
      Meteor.subscribe("userSubs", ['joblist']),
      Meteor.subscribe("jobItems")
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

Router.route('/jobItems/:type', {
  name: "jobItemsMasterType",
  path: '/jobItems/:type',
  template: "jobItemsListMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections'),
      Meteor.subscribe("userSubs", ['joblist'])
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

Router.route('/jobItem/submit', {
  name: "submitJobItem",
  path: '/jobItem/submit',
  template: "submitJobItemMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections')
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canUser('editJob')()) {
      Router.go("/");
    }
    var prep = JobTypes.findOne({"name": "Prep"});
    if(prep) {
      Session.set("jobType", prep._id);
    }
    Session.set("thisJobItem", null);
    Session.set("selectedIngredients", null);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/jobItem/:_id', {
  name: "jobItemDetailed",
  path: '/jobItem/:_id',
  template: "jobItemDetailedMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe("comments", this.params._id),
      Meteor.subscribe("usersList"),
      Meteor.subscribe("userSubs", [this.params._id, 'joblist'])
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisJobItem", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/jobItem/:_id/edit', {
  name: "jobItemEdit",
  path: '/jobItem/:_id/edit',
  template: "jobItemEditView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('sections')
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canUser('editJob')()) {
      Router.go("/");
    }
    Session.set("thisJobItem", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});