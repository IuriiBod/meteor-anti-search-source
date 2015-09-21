// ---------------------JOB ITEMS
Router.route('/jobItems', {
  name: "jobItemsMaster",
  path: '/jobItems',
  template: "jobItemsListMainView",
  waitOn: function() {
    return [
      subs.subscribe("allJobTypes"),
      subs.subscribe("allSections"),
      subs.subscribe("userSubs", ['joblist']),
      subs.subscribe("jobItems", [])
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
      subs.subscribe("allJobTypes"),
      subs.subscribe("allSections"),
      subs.subscribe("userSubs", ['joblist'])
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
      subs.subscribe("allJobTypes"),
      subs.subscribe("allSections")
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
      jobItemSubs(this.params._id),
      subs.subscribe("allJobTypes"),
      subs.subscribe("comments", this.params._id),
      subs.subscribe("usersList"),
      subs.subscribe("userSubs", [this.params._id, 'joblist'])
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
      subs.subscribe("allJobTypes"),
      jobItemSubs(this.params._id),
      subs.subscribe("allSections")
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

function jobItemSubs(id) {
  var cursors = [];
  var jobItemCursor = subs.subscribe("jobItems", [id]);
  cursors.push(jobItemCursor);
  if(jobItemCursor) {
    var jobItem = JobItems.findOne(id);
    if(jobItem) {
      if(jobItem.ingredients) {
        var ids = [];
        jobItem.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
        if(ids.length > 0) {
          cursors.push(subs.subscribe("ingredients", ids))
        }
      }
      if(jobItem.section) {
        cursors.push(subs.subscribe("section", jobItem.section));
      }
    }
  }
  return cursors;
}