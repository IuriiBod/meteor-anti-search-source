// ---------------------JOB ITEMS
Router.route('/jobItems', {
  name: 'jobItemsMaster',
  path: '/jobItems',
  template: 'jobItemsListMainView',
  waitOn: function() {
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections'),
      Meteor.subscribe('userSubscriptions'),
      Meteor.subscribe("jobItems", null, 'active')
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go('/');
    }
    Session.set('editStockTake', false);
  },
  fastRender: true
});

Router.route('/jobItems/:type', {
  name: 'jobItemsMasterType',
  path: '/jobItems/:type',
  template: 'jobItemsListMainView',
  waitOn: function() {
    return [
      Meteor.subscribe('jobTypes', null, 'archived'),
      Meteor.subscribe('sections'),
      Meteor.subscribe('userSubscriptions')
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go('/');
    }
    Session.set('editStockTake', false);
  },
  fastRender: true
});

Router.route('/jobItem/submit', {
  name: 'submitJobItem',
  path: '/jobItem/submit',
  template: 'submitJobItemMainView',
  waitOn: function() {
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections'),
      Meteor.subscribe("allSuppliers"),
      Meteor.subscribe("ingredients")
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit job')()) {
      Router.go('/');
    }
    var prep = JobTypes.findOne({'name': 'Prep'});
    if(prep) {
      Session.set('jobType', prep._id);
    }
    Session.set('thisJobItem', null);
    Session.set('editStockTake', false);
  },
  fastRender: true
});

Router.route('/jobItem/:_id', {
  name: 'jobItemDetailed',
  path: '/jobItem/:_id',
  template: 'jobItemDetailedMainView',
  waitOn: function() {
    return [
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe("comments", this.params._id),
      Meteor.subscribe("usersList"),
      Meteor.subscribe('userSubscriptions'),
      Meteor.subscribe('allCategories'),
      Meteor.subscribe('jobsRelatedMenus', this.params._id)
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go('/');
    }
    Session.set('thisJobItem', this.params._id);
    Session.set('editStockTake', false);
  },
  fastRender: true
});

Router.route('/jobItem/:_id/edit', {
  name: 'jobItemEdit',
  path: '/jobItem/:_id/edit',
  template: 'jobItemEditView',
  waitOn: function() {
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('sections'),
      Meteor.subscribe('ingredients'),
      Meteor.subscribe("allSuppliers")
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit job')()) {
      Router.go('/');
    }
    Session.set('thisJobItem', this.params._id);
    Session.set('editStockTake', false);
  },
  fastRender: true
});