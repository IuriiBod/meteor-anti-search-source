// ---------------------JOB ITEMS
Router.route('/jobItems', {
  name: "jobItemsMaster",
  path: '/jobItems',
  template: "jobItemsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(subs.subscribe("allSections"));
    cursors.push(subs.subscribe("userSubs", ['joblist']));

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

Router.route('/jobItems/:type', {
  name: "jobItemsMasterType",
  path: '/jobItems/:type',
  template: "jobItemsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(subs.subscribe("allSections"));
    cursors.push(subs.subscribe("userSubs", ['joblist']));

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

Router.route('/jobItem/submit', {
  name: "submitJobItem",
  path: '/jobItem/submit',
  template: "submitJobItemMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(subs.subscribe("allSections"));

    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
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
    var cursors = [];
    cursors = jobItemSubs(this.params._id);
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));
    cursors.push(subs.subscribe("userSubs", [this.params._id, 'joblist']));

    return cursors;
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
    var cursors = [];
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(jobItemSubs(this.params._id));
    cursors.push(subs.subscribe("allSections"));

    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisJobItem", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});